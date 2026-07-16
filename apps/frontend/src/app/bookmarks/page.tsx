'use client';

import { useEffect, useMemo } from 'react';
import { Bookmark, BookmarkX } from 'lucide-react';
import { useBookmarkStore } from '@/lib/hooks/useBookmarkStore';
import { useAllQuestions } from '@/lib/hooks/useQuestionBank';
import { QuestionCard } from '@/components/ui/QuestionCard';

export default function BookmarksPage() {
  const { load, loaded, bookmarkedIds } = useBookmarkStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const { data: allQuestions } = useAllQuestions();
  const bookmarked = useMemo(
    () => allQuestions?.filter((q) => bookmarkedIds.has(q.id)) ?? [],
    [allQuestions, bookmarkedIds],
  );

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <Bookmark size={20} strokeWidth={1.75} className="text-paper/60" />
        <div>
          <p className="page-header-title">Your shelf</p>
          <p className="page-header-sub">Bookmarked questions</p>
        </div>
      </div>

      <div className="content-area">
        {bookmarked.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-naub-gold-light border border-naub-gold/15">
              <BookmarkX size={28} strokeWidth={1.5} className="text-naub-gold/50" />
            </div>
            <div>
              <p className="text-heading text-ink">Nothing here yet</p>
              <p className="text-body text-muted mt-1.5 max-w-xs">
                Bookmark a question to start building your personal collection.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
            {bookmarked.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
