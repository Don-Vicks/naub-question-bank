'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, FileSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryOnAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileSearch,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  secondaryOnAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`col-span-full mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-14 text-center animate-fade-in-up ${className}`}
    >
      {/* Icon with soft glowing ring */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-army/10 via-army/5 to-naub-gold/10 border border-army/15 shadow-sm transition-transform duration-300 hover:scale-105">
        <div className="absolute -inset-2 rounded-full bg-army/5 blur-xl -z-10" />
        <Icon size={28} strokeWidth={1.75} className="text-army" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-ink tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 text-xs text-muted leading-relaxed max-w-xs">
          {description}
        </p>
      )}

      {/* Action buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
          {actionLabel && actionHref && (
            <Link href={actionHref} className="btn-primary w-full sm:w-auto text-xs px-5">
              {actionLabel}
            </Link>
          )}

          {actionLabel && !actionHref && onAction && (
            <button onClick={onAction} className="btn-primary w-full sm:w-auto text-xs px-5">
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && secondaryActionHref && (
            <Link href={secondaryActionHref} className="btn-secondary w-full sm:w-auto text-xs px-5">
              {secondaryActionLabel}
            </Link>
          )}

          {secondaryActionLabel && !secondaryActionHref && secondaryOnAction && (
            <button onClick={secondaryOnAction} className="btn-secondary w-full sm:w-auto text-xs px-5">
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
