'use client';

import Link from 'next/link';
import { Image, Bookmark, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { QuestionPaper } from '@/lib/types';
import { useBookmarkStore } from '@/lib/bookmark-store';

const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  ready: { label: 'Ready', dotClass: 'bg-naub-green', badgeClass: 'badge-success' },
  extracted: { label: 'Ready', dotClass: 'bg-naub-green', badgeClass: 'badge-success' },
  extracting: { label: 'Processing', dotClass: 'bg-naub-gold animate-pulse', badgeClass: 'badge-gold' },
  uploaded: { label: 'Queued', dotClass: 'bg-muted/40', badgeClass: 'badge-muted' },
  pending_review: { label: 'Pending Review', dotClass: 'bg-naub-gold animate-pulse', badgeClass: 'badge-gold' },
  failed: { label: 'Failed', dotClass: 'bg-terracotta', badgeClass: 'badge-danger' },
  splitting: { label: 'Splitting', dotClass: 'bg-naub-gold animate-pulse', badgeClass: 'badge-gold' },
};

export function PaperCard({ paper }: { paper: QuestionPaper }) {
  const status = STATUS_CONFIG[paper.status] ?? STATUS_CONFIG.uploaded;
  const bookmarked = useBookmarkStore((s) => s.bookmarkedPaperIds.includes(paper.id));
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(paper.id);
  };

  return (
    <Link
      href={`/paper/${paper.id}`}
      className="card-interactive group relative flex items-center gap-4 overflow-hidden p-4"
    >
      {/* Left accent */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-army via-naub-teal to-naub-gold opacity-0 transition-all duration-300 group-hover:opacity-100" />

      {/* Thumbnail */}
      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-line bg-paper-warm">
        {paper.thumbnailUrl ? (
          <img
            src={paper.thumbnailUrl}
            alt={paper.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink/5 to-ink/10">
            <Image size={16} strokeWidth={1.75} className="text-muted/40" />
          </div>
        )}
        <div className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${status.dotClass}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-heading text-ink transition-colors duration-200 group-hover:text-army">
          {paper.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          <span className="font-medium">
            {paper.examType} · {paper.session}
          </span>
          <span className="text-muted/30">·</span>
          <span>
            {paper.pageCount} {paper.pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>
      </div>

      {/* Bookmark Action */}
      <button
        onClick={handleBookmarkClick}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark paper'}
        className={clsx(
          'btn-icon flex-shrink-0 transition-all duration-200',
          bookmarked
            ? 'text-naub-gold bg-naub-gold-light/60 scale-105'
            : 'text-muted/30 hover:text-naub-gold hover:bg-naub-gold-light/30'
        )}
      >
        <Bookmark size={18} strokeWidth={bookmarked ? 2.5 : 1.75} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="flex-shrink-0 text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army"
      />
    </Link>
  );
}
