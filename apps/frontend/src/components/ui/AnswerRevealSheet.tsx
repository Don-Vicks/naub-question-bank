'use client';

import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Eye, ChevronDown } from 'lucide-react';

interface Props {
  answerLatex: string;
  onReportIssue: () => void;
}

export function AnswerRevealSheet({ answerLatex, onReportIssue }: Props) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="group flex w-full items-center justify-center gap-2.5 rounded-card-xl border border-dashed border-marigold/30 bg-marigold-50/50 py-4 text-sm font-semibold text-marigold transition-all duration-300 hover:border-marigold/50 hover:bg-marigold-50 hover:shadow-glow-sm active:scale-[0.99]"
      >
        <Eye size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:scale-110" />
        Reveal answer
        <ChevronDown size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-line-light bg-paper-warm px-4 py-3">
        <p className="text-caption font-semibold text-ink">Answer</p>
      </div>
      <div className="p-4 font-voice text-[15px] leading-relaxed text-ink">
        {answerLatex.split('\\\\').map((line, i) => (
          <BlockMath key={i} math={line.trim()} />
        ))}
      </div>
    </div>
  );
}
