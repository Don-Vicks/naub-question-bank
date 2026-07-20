'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, BookmarkX, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaperCard } from '@/components/ui/PaperCard';
import { useBookmarkStore } from '@/lib/bookmark-store';
import { usePapers } from '@/lib/hooks/useQuestionBank';

export default function BookmarksPage() {
  const router = useRouter();
  const bookmarkedPaperIds = useBookmarkStore((s) => s.bookmarkedPaperIds);
  const { data: allPapers, isLoading } = usePapers({});

  const bookmarkedPapers = (allPapers ?? []).filter((p) =>
    bookmarkedPaperIds.includes(p.id)
  );

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="btn-icon text-paper flex-shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-title">Saved Shelf</p>
          <p className="page-header-sub">
            {bookmarkedPaperIds.length} {bookmarkedPaperIds.length === 1 ? 'saved paper' : 'saved papers'}
          </p>
        </div>
      </div>

      <div className="content-area">
        {isLoading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-[88px] rounded-card-xl" />
            ))}
          </div>
        )}

        {!isLoading && bookmarkedPapers.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 stagger">
            {bookmarkedPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

        {!isLoading && bookmarkedPapers.length === 0 && (
          <EmptyState
            icon={BookmarkX}
            title="Your shelf is empty"
            description="Bookmark papers and courses while exploring to save them to your personal study collection."
            actionLabel="Browse Question Bank"
            actionHref="/browse"
          />
        )}
      </div>
    </div>
  );
}
