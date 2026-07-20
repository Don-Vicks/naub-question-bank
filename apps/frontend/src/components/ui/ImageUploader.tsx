'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image, FileText, Sparkles, FileCheck } from 'lucide-react';
import clsx from 'clsx';
import { dataUrlToFile } from '@/lib/hooks/useScanEffect';

interface FileEntry {
  file: File;
  uploadFile: File;
  previewUrl: string;
  isPdf: boolean;
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
  accept = 'application/pdf,image/jpeg,image/png,image/webp,.pdf,.png,.jpg,.jpeg',
}: ImageUploaderProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).slice(0, maxFiles - entries.length);
      if (files.length === 0) return;

      setProcessing(true);

      const newEntries: FileEntry[] = [];
      for (const file of files) {
        const isPdf =
          file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

        if (isPdf) {
          // Native PDF file upload — bypass image processing
          newEntries.push({
            file,
            uploadFile: file,
            previewUrl: '',
            isPdf: true,
          });
        } else if (file.type.startsWith('image/')) {
          // Process image with scan effect + compress WebP
          try {
            const processedDataUrl = await processImage(file);
            const uploadFile = await dataUrlToFile(processedDataUrl, file.name);
            newEntries.push({
              file,
              uploadFile,
              previewUrl: processedDataUrl,
              isPdf: false,
            });
          } catch {
            newEntries.push({
              file,
              uploadFile: file,
              previewUrl: URL.createObjectURL(file),
              isPdf: false,
            });
          }
        } else {
          // General fallback
          newEntries.push({
            file,
            uploadFile: file,
            previewUrl: URL.createObjectURL(file),
            isPdf: false,
          });
        }
      }

      const allEntries = [...entries, ...newEntries].slice(0, maxFiles);
      setEntries(allEntries);
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
            ? 'border-army bg-army-50 scale-[1.01] shadow-glow-sm'
            : 'border-line bg-white hover:border-army/30 hover:bg-army-50/30',
        )}
      >
        <div className={clsx(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300',
          isDragOver ? 'bg-army/15 scale-110' : 'bg-paper-warm',
        )}>
          <Upload
            size={24}
            strokeWidth={1.75}
            className={clsx(
              'transition-colors duration-300',
              isDragOver ? 'text-army' : 'text-muted/60',
            )}
          />
        </div>
        <div>
          <p className="text-body font-bold text-ink">
            Drop question papers here
          </p>
          <p className="mt-1 text-caption text-muted">
            Upload <span className="font-semibold text-army">PDF documents</span> or exam image photos · up to {maxFiles} files
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
        <div className="flex items-center justify-center gap-2 rounded-xl bg-army-50 px-4 py-2.5 text-caption text-army animate-fade-in">
          <Sparkles size={12} strokeWidth={2} className="animate-pulse text-naub-gold" />
          Processing files &amp; compressing...
        </div>
      )}

      {/* File grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {entries.map((entry, i) => (
            <div key={i} className="group relative">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-line bg-paper-warm shadow-card transition-shadow duration-200 group-hover:shadow-card-hover relative">
                {entry.isPdf ? (
                  /* PDF File Card Preview */
                  <div className="flex h-full w-full flex-col items-center justify-between p-3.5 bg-gradient-to-b from-terracotta-50/50 to-white text-center">
                    <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-white shadow-sm">
                      <FileText size={20} strokeWidth={2} />
                    </div>
                    <div className="my-auto min-w-0 w-full px-1">
                      <span className="inline-block rounded-md bg-terracotta/10 px-2 py-0.5 text-[9px] font-bold text-terracotta uppercase">
                        PDF Document
                      </span>
                      <p className="mt-1.5 truncate text-[11px] font-semibold text-ink">
                        {entry.file.name}
                      </p>
                      <p className="text-[10px] text-muted mt-0.5">
                        {formatFileSize(entry.file.size)}
                      </p>
                    </div>
                    <div className="w-full border-t border-line-light pt-1.5 flex items-center justify-center gap-1 text-[9px] font-medium text-naub-green">
                      <FileCheck size={10} />
                      <span>Ready to upload</span>
                    </div>
                  </div>
                ) : (
                  /* Image File Preview */
                  <img
                    src={entry.previewUrl}
                    alt={`Upload ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper opacity-0 shadow-elevated transition-all duration-200 group-hover:opacity-100"
                aria-label={`Remove file ${i + 1}`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>

              {/* Name & Compression info */}
              {!entry.isPdf && (
                <div className="mt-1.5 px-0.5">
                  <div className="flex items-center gap-1">
                    <Image size={10} strokeWidth={1.75} className="text-muted/50 flex-shrink-0" />
                    <p className="truncate text-[10px] text-muted/70">{entry.file.name}</p>
                  </div>
                  {entry.uploadFile !== entry.file && (
                    <div className="mt-0.5 flex items-center gap-0.5">
                      <Sparkles size={8} strokeWidth={2} className="text-naub-gold" />
                      <p className="text-[9px] text-army font-medium">
                        {Math.round((1 - entry.uploadFile.size / entry.file.size) * 100)}% compressed
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
