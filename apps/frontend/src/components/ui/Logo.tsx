'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = 'md',
  showSubtitle = true,
  href,
  className = '',
}: LogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const badgeSizeClass = isSm
    ? 'h-9 w-9 rounded-xl'
    : isLg
    ? 'h-14 w-14 rounded-2xl'
    : 'h-11 w-11 rounded-2xl';

  const iconSize = isSm ? 16 : isLg ? 24 : 19;

  const titleSizeClass = isSm
    ? 'text-base font-bold'
    : isLg
    ? 'text-2xl font-extrabold'
    : 'text-xl font-extrabold';

  const content = (
    <div className={clsx('flex items-center gap-3.5 group select-none', className)}>
      {/* Distinctive Military-Academic Crest Emblem */}
      <div
        className={clsx(
          'relative flex items-center justify-center bg-gradient-to-br from-army via-army-700 to-naub-gold p-[2px] shadow-glow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow flex-shrink-0',
          badgeSizeClass
        )}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-ink dark:bg-ink-dark text-white relative overflow-hidden">
          {/* Subtle background glow inside badge */}
          <div className="absolute inset-0 bg-gradient-to-br from-army/40 via-transparent to-naub-gold/20" />
          <BookOpen size={iconSize} strokeWidth={2} className="relative z-10 text-paper" />
          <Sparkles size={iconSize * 0.55} className="absolute -top-0.5 -right-0.5 z-20 text-naub-gold animate-pulse" />
        </div>
      </div>

      {/* Wordmark Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={clsx('text-ink dark:text-paper tracking-tight leading-none', titleSizeClass)}
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Padi
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-naub-gold shadow-glow-gold" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-army dark:text-naub-teal bg-army/10 dark:bg-naub-teal/15 px-1.5 py-0.5 rounded-md border border-army/15 dark:border-naub-teal/20">
            NAUB
          </span>
        </div>

        {showSubtitle && (
          <p
            className={clsx(
              'font-semibold text-muted dark:text-white/50 tracking-wide mt-1',
              isSm ? 'text-[9px]' : isLg ? 'text-xs' : 'text-[10px]'
            )}
          >
            Question Bank & Repository
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Padi NAUB Question Bank">
        {content}
      </Link>
    );
  }

  return content;
}
