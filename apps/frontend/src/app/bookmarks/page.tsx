'use client';

import { useEffect, useMemo } from 'react';
import { useBookmarkStore } from '@/lib/hooks/useBookmarkStore';
import { useQuestionsByCourse } from '@/lib/hooks/useQuestionBank';
import { QuestionCard } from '@/components/ui/QuestionCard';

export default function BookmarksPage() {
  const { load, loaded, bookmarkedIds } = useBookmarkStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  // NOTE: placeholder data source until the backend has a
  // `GET /questions?ids=` batch endpoint - fetching bookmarked questions
  // across arbitrary courses is the real shape once that exists.
  const { data: candidateQuestions } = useQuestionsByCourse('swe218');
  const bookmarked = useMemo(
    () => candidateQuestions?.filter((q) => bookmarkedIds.has(q.id)) ?? [],
    [candidateQuestions, bookmarkedIds],
  );

  return (
    <div className="p-4 md:px-0 md:py-6">
      <p className="mb-3 text-sm font-medium text-ink">Your shelf</p>

      {bookmarked.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Nothing on your shelf yet — bookmark a question to start building
          it.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {bookmarked.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
