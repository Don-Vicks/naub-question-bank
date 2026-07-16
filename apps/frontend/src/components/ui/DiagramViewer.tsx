'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

export function DiagramViewer({ src, alt }: { src: string; alt: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        className="group relative block w-full overflow-hidden rounded-card-xl border border-line bg-white shadow-card transition-all duration-300 hover:shadow-card-hover"
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={360}
          className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink/70 text-paper backdrop-blur-sm">
            <ZoomIn size={14} strokeWidth={1.75} />
          </div>
        </div>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setExpanded(false)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-paper transition-colors hover:bg-white/20"
            aria-label="Close"
            onClick={() => setExpanded(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto object-contain rounded-lg animate-scale-in"
          />
        </div>
      )}
    </>
  );
}
