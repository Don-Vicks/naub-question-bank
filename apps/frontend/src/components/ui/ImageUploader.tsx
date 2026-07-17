'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image, File, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { dataUrlToFile } from '@/lib/hooks/useScanEffect';

interface FileEntry {
  file: File;           // original — used for display name / type check
  uploadFile: File;     // what actually gets sent to the server (processed WebP or original PDF)
  previewUrl: string;   // shown in thumbnail — processed version when available
}

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;  // receives the upload-ready files
  processImage: (file: File) => Promise<string>;
  maxFiles?: number;
  accept?: string;
}

export function ImageUploader({
  onFilesChange,
  processImage,
  maxFiles = 10,
  accept = 'image/jpeg,image/png,application/pdf',
}: ImageUploaderProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).slice(0, maxFiles - entries.length);
      if (files.length === 0) return;

      setProcessing(true);

      const newEntries: FileEntry[] = [];
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          // Apply scan effect + compress to WebP
          try {
            const processedDataUrl = await processImage(file);
            const uploadFile = await dataUrlToFile(processedDataUrl, file.name);
            newEntries.push({
              file,
              uploadFile,
              previewUrl: processedDataUrl,
            });
          } catch {
            // Fallback: use original if processing fails
            newEntries.push({
              file,
              uploadFile: file,
              previewUrl: URL.createObjectURL(file),
            });
          }
        } else {
          // PDF or other — no client-side processing
          newEntries.push({
            file,
            uploadFile: file,
            previewUrl: URL.createObjectURL(file),
          });
        }
      }

      const allEntries = [...entries, ...newEntries].slice(0, maxFiles);
      setEntries(allEntries);
      // Pass the processed upload-ready files up — not the originals
      onFilesChange(allEntries.map((e) => e.uploadFile));
      setProcessing(false);
    },
    [entries, maxFiles, onFilesChange, processImage],
  );

  const removeFile = useCallback(
    (index: number) => {
      const next = entries.filter((_, i) => i !== index);
      setEntries(next);
      onFilesChange(next.map((e) => e.uploadFile));
    },
    [entries, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={clsx(
          'relative flex w-full flex-col items-center gap-4 rounded-card-xl border-2 border-dashed p-8 text-center transition-all duration-300',
          isDragOver
            ? 'border-marigold bg-marigold-50 scale-[1.01] shadow-glow-sm'
            : 'border-line bg-white hover:border-marigold/30 hover:bg-marigold-50/30',
        )}
      >
        <div className={clsx(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300',
          isDragOver ? 'bg-marigold/15 scale-110' : 'bg-paper-warm',
        )}>
          <Upload
            size={22}
            strokeWidth={1.75}
            className={clsx(
              'transition-colors duration-300',
              isDragOver ? 'text-marigold' : 'text-muted/50',
            )}
          />
        </div>
        <div>
          <p className="text-body font-semibold text-ink">
            Drop question papers here
          </p>
          <p className="mt-1 text-caption text-muted">
            or tap to browse · PDF, JPG, PNG · up to {maxFiles} files
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Processing indicator */}
      {processing && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-marigold-50 px-4 py-2.5 text-caption text-marigold animate-fade-in">
          <Sparkles size={12} strokeWidth={2} className="animate-pulse" />
          Applying scan effect &amp; compressing...
        </div>
      )}

      {/* File grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
          {entries.map((entry, i) => (
            <div key={i} className="group relative">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-line bg-paper-warm shadow-card transition-shadow duration-200 group-hover:shadow-card-hover">
                {entry.file.type === 'application/pdf' ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-paper-warm">
                    <File size={24} strokeWidth={1.5} className="text-muted/40" />
                    <p className="px-1 text-center text-[9px] font-medium text-muted/60 leading-tight">PDF</p>
                  </div>
                ) : (
                  <img
                    src={entry.previewUrl}
                    alt={`Upload ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper opacity-0 shadow-elevated transition-all duration-200 group-hover:opacity-100"
                aria-label={`Remove file ${i + 1}`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
              <div className="mt-1.5 flex items-center gap-1 px-0.5">
                {entry.file.type.startsWith('image/') ? (
                  <Image size={10} strokeWidth={1.75} className="text-muted/50" />
                ) : (
                  <File size={10} strokeWidth={1.75} className="text-muted/50" />
                )}
                <p className="truncate text-[10px] text-muted/70">
                  {entry.file.name}
                </p>
              </div>
              {/* Show compression badge for processed images */}
              {entry.file.type.startsWith('image/') && entry.uploadFile !== entry.file && (
                <div className="mt-0.5 flex items-center gap-0.5 px-0.5">
                  <Sparkles size={8} strokeWidth={2} className="text-marigold/70" />
                  <p className="text-[9px] text-marigold/70 font-medium">
                    {Math.round((1 - entry.uploadFile.size / entry.file.size) * 100)}% smaller
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
