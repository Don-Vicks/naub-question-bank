'use client';

import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Flag, Eye, ChevronDown } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ReviewStatus } from '@/lib/types';

interface Props {
  answerLatex: string;
  reviewStatus: ReviewStatus;
  onReportIssue: () => void;
}

export function AnswerRevealSheet({ answerLatex, reviewStatus, onReportIssue }: Props) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="group flex w-full items-center justify-center gap-2.5 rounded-card-xl border border-dashed border-marigold/30 bg-marigold-50/50 py-4 text-sm font-semibold text-marigold transition-all duration-300 hover:border-marigold/50 hover:bg-marigold-50 hover:shadow-glow-sm active:scale-[0.99]"
      >
        <Eye size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:scale-110" />
        Reveal Padi&apos;s answer
        <ChevronDown size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-line-light bg-paper-warm px-4 py-3">
        <p className="text-caption font-semibold text-ink">Padi&apos;s answer</p>
        <ConfidenceBadge status={reviewStatus} />
      </div>
      <div className="p-4 font-voice text-[15px] leading-relaxed text-ink">
        {answerLatex.split('\\\\').map((line, i) => (
          <BlockMath key={i} math={line.trim()} />
        ))}
      </div>
      <button
        onClick={onReportIssue}
        className="flex w-full items-center gap-2 border-t border-line-light px-4 py-3 text-[11px] font-medium text-muted transition-colors duration-200 hover:bg-terracotta-50 hover:text-terracotta"
      >
        <Flag size={12} strokeWidth={1.75} />
        Report an issue
      </button>
    </div>
  );
}
