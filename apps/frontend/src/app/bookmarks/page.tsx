'use client';

import { Bookmark, BookmarkX } from 'lucide-react';

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
        <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-naub-gold-light border border-naub-gold/15">
            <BookmarkX size={28} strokeWidth={1.5} className="text-naub-gold/50" />
          </div>
          <div>
            <p className="text-heading text-ink">Coming soon</p>
            <p className="text-body text-muted mt-1.5 max-w-xs">
              Bookmark individual questions to build your personal collection. This feature is coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
