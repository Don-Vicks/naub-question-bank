# Wiring into your existing NestJS app

1. Install deps:

```bash
npm install @google/generative-ai bullmq @nestjs/bullmq sharp pdf-poppler uuid multer @nestjs/platform-express class-validator
npm install -D @types/multer @types/uuid
```

System dependency (for pdf-poppler / pdftoppm):

```bash
# Debian/Ubuntu
sudo apt-get install -y poppler-utils
```

3. Install the SQLite driver (file-based, zero infra - no DB server to run,
   which fits a no-funding setup better than Postgres does):

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

In your `AppModule`:

```ts
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBankModule } from './question-bank/question-bank.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './data/question-bank.db', // single file, back it up like any file
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // fine for early dev; switch to migrations once stable
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    QuestionBankModule,
  ],
})
export class AppModule {}
```

Notes on SQLite here specifically:
- Your write pattern is one row per extracted question during a background
  batch job, not concurrent user-facing traffic - exactly what SQLite
  handles well. It's a genuinely better fit here, not just a cheaper one.
- Enable WAL mode once (`PRAGMA journal_mode = WAL;`, e.g. via a startup
  script or `better-sqlite3`'s `pragma()` call) so the BullMQ worker writing
  and any API reads don't block each other.
- If you outgrow this later (many concurrent editors, multi-server deploy),
  swapping `type: 'better-sqlite3'` for `type: 'postgres'` with connection
  config is the only change needed - TypeORM entities/services above don't
  change at all.

You still need Redis for BullMQ itself (that's queue state, not your data -
a small `docker run -d -p 6379:6379 redis:alpine` is enough, or use a free
Redis Cloud tier if you'd rather not run anything locally).

4. Copy `src/question-bank/` into your project's `src/` directory and drop
   the `.env` values from the README in. With `synchronize: true` (shown
   above), the `SourceDocument` and `Question` tables get created
   automatically on first run — no manual migration needed for local/early
   dev. Switch to proper TypeORM migrations before this goes anywhere
   production-facing.

5. Test the flow:

```bash
curl -X POST http://localhost:3000/question-bank/documents/upload \
  -F "file=@sample-paper.pdf" \
  -F "subjectHint=Physics"

curl http://localhost:3000/question-bank/documents/<id>/status

curl http://localhost:3000/question-bank/review/queue
curl http://localhost:3000/question-bank/review/stats
```

## Bulk folder ingestion (1k+ files at once)

You don't need to hit the upload endpoint one file at a time. Two options:

**Option A — CLI script (recommended for a folder already sitting on disk)**

```bash
npx ts-node scripts/bulk-ingest.ts /path/to/your/question-files \
  --api http://localhost:3000 \
  --concurrency 5
```

- Recursively walks the folder for `.pdf`, `.png`, `.jpg`, `.jpeg`.
- If your files are organized in subfolders by subject (e.g.
  `question-files/Physics/paper1.pdf`), it auto-guesses `subjectHint` from
  the immediate subfolder name. Override with `--subject "Physics"` to force
  one subject for the whole run, or `--no-subject-guess` to leave it null.
- Writes a `.ingest-manifest.json` inside the target folder as it goes, so if
  it crashes or you Ctrl-C halfway through 1,000 files, re-running the same
  command skips everything already submitted and only processes what's left.
- `--concurrency` controls how many files are uploaded in parallel - keep
  this modest (3-5) since each upload triggers a queued Gemini extraction
  job; you're not trying to parallelize the AI calls here, just the uploads.

**Option B — batch HTTP endpoint (if you want a browser folder-picker)**

```html
<input type="file" webkitdirectory multiple />
```

POST the selected files as multipart form data (field name `files`) to:

```
POST /question-bank/documents/upload-batch
```

Same effect as the CLI - one `SourceDocument` + one queue job per file - just
triggered from a single browser interaction instead of a terminal command.
Capped at 500 files per request; for more than that, split into a couple of
batches or use the CLI script instead.

Either way, the queue (BullMQ, concurrency already set in
`extraction.processor.ts`) is what actually paces the Gemini calls - so
whether you submit 1,000 files via the CLI in one go or trickle them in over
a day, the extraction rate is controlled in one place, not by however fast
you upload.

## Tuning knobs once it's running


- `CONFIDENCE_THRESHOLD` — raise it (e.g. 0.85) if too much junk is slipping
  through to "approved"; lower it (e.g. 0.6) if your review queue is too big
  to clear.
- Processor `concurrency` in `extraction.processor.ts` — raise cautiously,
  watch Gemini free-tier rate limits (currently ~15 req/min, ~1,500/day on
  Flash - confirm current limits in Google AI Studio before scaling up).
- Once you're comfortable with sync extraction, revisit `extractPagesBatch()`
  in `gemini-extraction.service.ts` for true async batch submission at higher
  volume/lower cost.
