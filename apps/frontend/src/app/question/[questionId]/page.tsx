'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { IconArrowLeft, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { useQuestion } from '@/lib/hooks/useQuestionBank';
import { useBookmarkStore } from '@/lib/hooks/useBookmarkStore';
import { AnswerRevealSheet } from '@/components/ui/AnswerRevealSheet';
import { DiagramViewer } from '@/components/ui/DiagramViewer';
import { api } from '@/lib/api';

export default function QuestionPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();
  const { data: question, isLoading } = useQuestion(questionId);
  const { load, toggle, isBookmarked, loaded } = useBookmarkStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  if (isLoading || !question) {
    return (
      <div className="p-4 md:px-0 md:py-6">
        <div className="h-32 animate-pulse rounded-card bg-white" />
      </div>
    );
  }

  const bookmarked = isBookmarked(question.id);

  return (
    <div>
      <header className="flex items-center gap-3 bg-ink px-4 py-4 md:rounded-card md:px-6 md:py-4">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden">
          <IconArrowLeft size={18} stroke={1.75} className="text-paper" />
        </button>
        <p className="text-[13px] font-medium text-paper">
          {question.examType} · {question.session}
        </p>
      </header>

      {/* Two-pane on lg+: question/diagram in the wide left column, the
          answer panel sticky in a fixed-width right rail - avoids a single
          narrow reading column stranded in the middle of a wide screen,
          which is what stacking everything (the mobile layout) would do
          here. Falls back to the mobile stacked flow below lg. */}
      <div className="p-4 md:px-0 md:py-6 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-6">
        <div>
          <p className="mb-1 text-[11px] font-medium text-muted">
            Question {question.number}
          </p>
          <div className="mb-3 font-voice text-[14px] leading-relaxed text-ink lg:text-[15px]">
            <BlockMath math={question.textLatex} />
          </div>

          {question.hasDiagram && question.diagramAssetUrl && (
            <div className="mb-3.5 lg:max-w-lg">
              <DiagramViewer
                src={question.diagramAssetUrl}
                alt={`Diagram for question ${question.number}`}
              />
              <p className="mt-1.5 text-center text-[10px] text-muted">
                original scanned diagram
              </p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6">
          <AnswerRevealSheet
            answerLatex={question.answerLatex}
            reviewStatus={question.answerReviewStatus}
            onReportIssue={() =>
              api.reportIssue(question.id, { reason: 'other' })
            }
          />

          <div className="mt-3.5 flex items-center justify-end">
            <button
              onClick={() => toggle(question.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? (
                <IconBookmarkFilled size={20} className="text-marigold" />
              ) : (
                <IconBookmark size={20} stroke={1.75} className="text-marigold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
