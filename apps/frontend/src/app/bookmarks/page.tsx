'use client';

import { Bookmark, BookmarkX } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function BookmarksPage() {
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
        <EmptyState
          icon={BookmarkX}
          title="Your shelf is empty"
          description="Bookmark individual questions and courses to build your personal study collection."
          actionLabel="Browse Question Bank"
          actionHref="/browse"
        />
      </div>
    </div>
  );
}
