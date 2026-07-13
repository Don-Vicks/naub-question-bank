import Link from 'next/link';
import { IconPhoto, IconChevronRight } from '@tabler/icons-react';
import { QuestionSummary } from '@/lib/types';
import { ConfidenceBadge } from './ConfidenceBadge';

export function QuestionCard({ question }: { question: QuestionSummary }) {
  return (
    <Link
      href={`/question/${question.id}`}
      className="flex items-center gap-3 rounded-card border border-line bg-white p-3 active:bg-paper md:hover:border-ink/20"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-paper text-[12px] font-medium text-ink">
        {question.number}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-ink">{question.textPreview}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted">
            {question.examType} · {question.session}
          </span>
          {question.hasDiagram && (
            <IconPhoto size={13} stroke={1.75} className="text-muted" />
          )}
          <ConfidenceBadge status={question.reviewStatus} />
        </div>
      </div>
      <IconChevronRight size={16} stroke={1.75} className="text-muted" />
    </Link>
  );
}
