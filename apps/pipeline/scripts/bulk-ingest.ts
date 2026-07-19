/**
 * Bulk folder ingestion CLI.
 *
 * Walks a local folder (recursively) for .pdf/.png/.jpg/.jpeg files and
 * POSTs each one to the ingestion endpoint, which queues it through the same
 * BullMQ pipeline as a single upload. Built for the "I have 1,000 scanned
 * question files sitting in a folder" case - you don't touch the browser at
 * all.
 *
 * Usage:
 *   npx ts-node scripts/bulk-ingest.ts ./path/to/folder \
 *     --api http://localhost:3000 \
 *     --subject "Physics" \
 *     --concurrency 5
 *
 * Notes:
 * - Resumable: keeps a manifest (.ingest-manifest.json) in the target folder
 *   recording which files were already submitted successfully, so re-running
 *   after a crash/interrupt skips completed files instead of re-uploading.
 * - subjectHint is optional. If omitted, the script guesses it from the
 *   immediate parent folder name (e.g. a folder named "Chemistry/2023" ->
 *   subjectHint "Chemistry"), which is handy if you organize your backlog
 *   by subject folders. Override with the parent-folder guess disabled via
 *   --no-subject-guess if you'd rather leave it null and let Gemini guess
 *   per-page instead.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

// Node 18+ has global fetch/FormData/Blob - no extra deps needed for this script.

const SUPPORTED_EXT = new Set(['.pdf', '.png', '.jpg', '.jpeg']);
const MANIFEST_FILENAME = '.ingest-manifest.json';

interface Args {
  folder: string;
  api: string;
  subject?: string;
  concurrency: number;
  guessSubjectFromFolder: boolean;
}

interface Manifest {
  // filePath -> { documentId, status }
  [filePath: string]: { documentId: string; status: 'submitted' };
}

function parseArgs(argv: string[]): Args {
  const folder = argv[2];
  if (!folder) {
    console.error(
      'Usage: ts-node scripts/bulk-ingest.ts <folder> [--api url] [--subject "X"] [--concurrency N] [--no-subject-guess]',
    );
    process.exit(1);
  }

  const get = (flag: string) => {
    const idx = argv.indexOf(flag);
    return idx !== -1 ? argv[idx + 1] : undefined;
  };

  return {
    folder: path.resolve(folder),
    api: get('--api') ?? 'http://localhost:3000',
    subject: get('--subject'),
    concurrency: Number(get('--concurrency') ?? 4),
    guessSubjectFromFolder: !argv.includes('--no-subject-guess'),
  };
}

async function walkFolder(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFolder(fullPath)));
    } else if (SUPPORTED_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadManifest(folder: string): Promise<Manifest> {
  const manifestPath = path.join(folder, MANIFEST_FILENAME);
  if (!fsSync.existsSync(manifestPath)) return {};
  try {
    return JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  } catch {
    return {};
  }
}

async function saveManifest(folder: string, manifest: Manifest): Promise<void> {
  const manifestPath = path.join(folder, MANIFEST_FILENAME);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

function guessSubject(filePath: string, folderRoot: string): string | undefined {
  const rel = path.relative(folderRoot, filePath);
  const parts = rel.split(path.sep);
  return parts.length > 1 ? parts[0] : undefined;
}

async function uploadFile(
  api: string,
  filePath: string,
  subjectHint?: string,
): Promise<{ documentId: string }> {
  const fileBuffer = await fs.readFile(filePath);
  const form = new FormData();
  const blob = new Blob([fileBuffer]);
  form.append('file', blob, path.basename(filePath));
  if (subjectHint) form.append('subjectHint', subjectHint);

  const res = await fetch(`${api}/question-bank/documents/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  const runners = new Array(Math.min(limit, items.length))
    .fill(null)
    .map(async () => {
      while (cursor < items.length) {
        const index = cursor++;
        await worker(items[index], index);
      }
    });
  await Promise.all(runners);
}

async function main() {
  const args = parseArgs(process.argv);

  console.log(`Scanning ${args.folder} for pdf/png/jpeg files...`);
  const allFiles = await walkFolder(args.folder);
  console.log(`Found ${allFiles.length} candidate files.`);

  const manifest = await loadManifest(args.folder);
  const pending = allFiles.filter((f) => !manifest[f]);
  const alreadyDone = allFiles.length - pending.length;
  if (alreadyDone > 0) {
    console.log(
      `Skipping ${alreadyDone} already-submitted files (per manifest). ` +
        `Delete ${MANIFEST_FILENAME} in the folder to force re-upload.`,
    );
  }

  let succeeded = 0;
  let failed = 0;

  await runWithConcurrency(pending, args.concurrency, async (filePath) => {
    const subjectHint =
      args.subject ??
      (args.guessSubjectFromFolder
        ? guessSubject(filePath, args.folder)
        : undefined);

    try {
      const { documentId } = await uploadFile(args.api, filePath, subjectHint);
      manifest[filePath] = { documentId, status: 'submitted' };
      succeeded++;
      console.log(
        `[${succeeded + failed}/${pending.length}] OK  ${path.basename(filePath)} -> ${documentId}`,
      );
    } catch (err: any) {
      failed++;
      console.error(
        `[${succeeded + failed}/${pending.length}] FAIL ${path.basename(filePath)}: ${err.message}`,
      );
    }

    await saveManifest(args.folder, manifest);
  });

  console.log(
    `\nDone. ${succeeded} submitted, ${failed} failed, ${alreadyDone} already done previously.`,
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
