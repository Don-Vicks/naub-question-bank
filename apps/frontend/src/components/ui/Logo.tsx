'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Sparkles } from 'lucide-react';

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
    ? 'h-8 w-8 rounded-xl text-xs'
    : isLg
    ? 'h-14 w-14 rounded-2xl text-2xl'
    : 'h-10 w-10 rounded-2xl text-base';

  const titleSizeClass = isSm
    ? 'text-base font-bold'
    : isLg
    ? 'text-2xl font-extrabold'
    : 'text-xl font-extrabold';

  const content = (
    <div className={clsx('flex items-center gap-3 group select-none', className)}>
      {/* Icon Badge */}
      <div
        className={clsx(
          'flex items-center justify-center bg-gradient-army font-bold text-white shadow-glow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow flex-shrink-0',
          badgeSizeClass
        )}
      >
        <span>P</span>
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
          <Sparkles size={isSm ? 10 : 12} className="text-naub-gold opacity-80" />
        </div>

        {showSubtitle && (
          <p
            className={clsx(
              'font-medium text-muted dark:text-white/50 tracking-wide mt-0.5',
              isSm ? 'text-[9px]' : isLg ? 'text-xs' : 'text-[10px]'
            )}
          >
            NAUB Question Bank
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
