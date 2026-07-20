'use client';

import React from 'react';

interface WatermarkOverlayProps {
  text?: string;
  className?: string;
}

export function WatermarkOverlay({
  text = 'naubpadi.com.ng',
  className = '',
}: WatermarkOverlayProps) {
  // Create a grid array for diagonal repeating watermark pattern
  const rows = Array.from({ length: 6 });
  const cols = Array.from({ length: 4 });

  return (
    <div
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-20 ${className}`}
      aria-hidden="true"
    >
      {/* Repeating diagonal text grid */}
      <div className="absolute inset-0 flex flex-col justify-around rotate-[-25deg] scale-125 opacity-[0.08] dark:opacity-[0.12]">
        {rows.map((_, rIndex) => (
          <div
            key={rIndex}
            className="flex justify-around items-center whitespace-nowrap gap-12 text-sm font-extrabold tracking-widest text-ink uppercase"
          >
            {cols.map((_, cIndex) => (
              <span key={cIndex} className="tracking-widest">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom corner watermark stamp */}
      <div className="absolute bottom-3 right-3 z-30 rounded-xl bg-ink/75 px-3 py-1.5 backdrop-blur-md shadow-sm border border-white/10">
        <p className="text-[10px] font-bold tracking-wider text-paper uppercase">
          NAUB PADI <span className="opacity-40">|</span> {text}
        </p>
      </div>
    </div>
  );
}
