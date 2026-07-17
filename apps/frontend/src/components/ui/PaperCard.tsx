import Link from 'next/link';
import { Image, Clock, ChevronRight } from 'lucide-react';
import { QuestionPaper } from '@/lib/types';

const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  extracted: { label: 'Ready', dotClass: 'bg-verified', badgeClass: 'badge-success' },
  extracting: { label: 'Processing', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
  uploaded: { label: 'Queued', dotClass: 'bg-muted/40', badgeClass: 'badge-muted' },
  failed: { label: 'Failed', dotClass: 'bg-terracotta', badgeClass: 'badge-danger' },
  splitting: { label: 'Splitting', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
  });
}

export function PaperCard({ paper }: { paper: QuestionPaper }) {
  const status = STATUS_CONFIG[paper.status] ?? STATUS_CONFIG.uploaded;

  return (
    <Link
      href={`/paper/${paper.id}`}
      className="card-interactive group relative flex items-center gap-4 overflow-hidden p-4"
    >
      {/* Gradient left accent */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-naub-teal via-army/40 to-marigold opacity-0 transition-all duration-300 group-hover:opacity-100" />

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
            <Image size={16} strokeWidth={1.75} className="text-muted/30" />
          </div>
        )}
        {/* Status dot */}
        <div className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${status.dotClass}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-heading text-ink transition-colors duration-200 group-hover:text-army">
          {paper.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted font-medium">
            {paper.examType} · {paper.session}
          </span>
          <span className="text-muted/30">·</span>
          <span className="text-[11px] text-muted">
            {paper.pageCount} {paper.pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>
      </div>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="flex-shrink-0 text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army"
      />
    </Link>
  );
}
