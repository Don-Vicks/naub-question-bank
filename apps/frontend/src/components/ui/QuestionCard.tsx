import Link from 'next/link';
import { Image, ChevronRight } from 'lucide-react';
import { QuestionSummary } from '@/lib/types';
import { ConfidenceBadge } from './ConfidenceBadge';

export function QuestionCard({ question }: { question: QuestionSummary }) {
  return (
    <Link
      href={`/question/${question.id}`}
      className="card-interactive group flex items-center gap-4 p-4"
    >
      {/* Number badge */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ink/5 to-ink/10 text-sm font-bold text-ink transition-all duration-300 group-hover:from-marigold group-hover:to-marigold-500 group-hover:text-white group-hover:shadow-glow-sm">
        {question.number}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-body text-ink transition-colors duration-200">
          {question.textPreview}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {question.hasDiagram && (
            <div className="flex items-center gap-1 text-muted">
              <Image size={11} strokeWidth={1.75} />
              <span className="text-[10px] font-medium">Diagram</span>
            </div>
          )}
          <ConfidenceBadge status={question.reviewStatus} />
        </div>
      </div>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="flex-shrink-0 text-muted/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
      />
    </Link>
  );
}
