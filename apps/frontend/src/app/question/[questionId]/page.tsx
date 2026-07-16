'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
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
      <div className="page-desktop">
        <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
          <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <div><p className="page-header-title">Loading...</p></div>
        </div>
        <div className="content-area"><div className="skeleton h-48 rounded-card-xl" /></div>
      </div>
    );
  }

  const bookmarked = isBookmarked(question.id);

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-title">Question {question.number}</p>
        </div>
      </div>

      <div className="content-area">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-8">
          <div className="animate-fade-in">
            <div className="rounded-card-xl border border-line bg-white p-4 shadow-card">
              <img
                src={question.sourcePageImageUrl}
                alt={`Question ${question.number}`}
                className="w-full object-contain"
              />
            </div>

            {question.hasDiagram && question.diagramAssetUrl && (
              <div className="mt-4 lg:max-w-lg">
                <DiagramViewer
                  src={question.diagramAssetUrl}
                  alt={`Diagram for question ${question.number}`}
                />
                <p className="mt-2 text-center text-[10px] text-muted font-medium">
                  original scanned diagram
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 lg:mt-0 lg:sticky lg:top-6 animate-fade-in-up">
            <AnswerRevealSheet
              answerLatex={question.answerLatex}
              reviewStatus={question.answerReviewStatus}
              onReportIssue={() => api.reportIssue(question.id, { reason: 'other' })}
            />

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => toggle(question.id)}
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                className="btn-icon"
              >
                {bookmarked ? (
                  <BookmarkCheck size={22} className="text-naub-gold" />
                ) : (
                  <Bookmark size={22} strokeWidth={1.75} className="text-naub-gold/50 hover:text-naub-gold" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
