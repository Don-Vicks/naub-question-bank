'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image, File, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface FileEntry {
  file: File;
  previewUrl: string;
  processedUrl: string | null;
}

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
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
        const previewUrl = URL.createObjectURL(file);
        let processedUrl: string | null = null;

        if (file.type.startsWith('image/')) {
          try {
            processedUrl = await processImage(file);
          } catch {
            processedUrl = null;
          }
        }

        newEntries.push({ file, previewUrl, processedUrl });
      }

      const allEntries = [...entries, ...newEntries].slice(0, maxFiles);
      setEntries(allEntries);
      onFilesChange(allEntries.map((e) => e.file));
      setProcessing(false);
    },
    [entries, maxFiles, onFilesChange, processImage],
  );

  const removeFile = useCallback(
    (index: number) => {
      const entry = entries[index];
      URL.revokeObjectURL(entry.previewUrl);
      if (entry.processedUrl) URL.revokeObjectURL(entry.processedUrl);

      const next = entries.filter((_, i) => i !== index);
      setEntries(next);
      onFilesChange(next.map((e) => e.file));
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
          Applying scan effect...
        </div>
      )}

      {/* File grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
          {entries.map((entry, i) => (
            <div key={i} className="group relative">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-line bg-paper-warm shadow-card transition-shadow duration-200 group-hover:shadow-card-hover">
                <img
                  src={entry.processedUrl ?? entry.previewUrl}
                  alt={`Upload ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
