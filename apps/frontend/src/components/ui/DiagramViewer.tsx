'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IconX } from '@tabler/icons-react';

// Full pinch-zoom gesture handling belongs in the native app; on web, a
// tap-to-expand overlay covers the same need (see design-system.md - many
// diagrams have fine detail like circuit values or graph axis labels that
// need a closer look).
export function DiagramViewer({ src, alt }: { src: string; alt: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        className="block w-full overflow-hidden rounded-lg border border-line bg-paper"
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={360}
          className="h-auto w-full object-contain"
          loading="lazy"
        />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setExpanded(false)}
        >
          <button
            className="absolute right-4 top-4 text-paper"
            aria-label="Close"
            onClick={() => setExpanded(false)}
          >
            <IconX size={24} stroke={1.75} />
          </button>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-h-full w-auto object-contain"
          />
        </div>
      )}
    </>
  );
}
