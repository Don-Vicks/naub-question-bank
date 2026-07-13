'use client';

import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { IconFlag } from '@tabler/icons-react';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ReviewStatus } from '@/lib/types';

interface Props {
  answerLatex: string;
  reviewStatus: ReviewStatus;
  onReportIssue: () => void;
}

// Collapsed by default - see ux-flows.md: revealing immediately defeats
// practice value even in plain browse mode, so this is a deliberate tap.
export function AnswerRevealSheet({ answerLatex, reviewStatus, onReportIssue }: Props) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="w-full rounded-card border border-line bg-white py-3 text-[13px] font-medium text-ink active:bg-paper"
      >
        Reveal Padi's answer
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <div className="flex items-center justify-between bg-paper px-3 py-2.5">
        <p className="text-[12.5px] font-medium text-ink">Padi's answer</p>
        <ConfidenceBadge status={reviewStatus} />
      </div>
      <div className="p-3 font-voice text-[13px] leading-relaxed text-ink">
        {answerLatex.split('\\\\').map((line, i) => (
          <BlockMath key={i} math={line.trim()} />
        ))}
      </div>
      <button
        onClick={onReportIssue}
        className="flex w-full items-center gap-1.5 border-t border-line px-3 py-2.5 text-[11.5px] text-muted"
      >
        <IconFlag size={14} stroke={1.75} />
        Report an issue
      </button>
    </div>
  );
}
