import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookmarkState {
  bookmarkedPaperIds: string[];
  toggleBookmark: (paperId: string) => void;
  isBookmarked: (paperId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedPaperIds: [],
      toggleBookmark: (paperId: string) =>
        set((state) => {
          const exists = state.bookmarkedPaperIds.includes(paperId);
          return {
            bookmarkedPaperIds: exists
              ? state.bookmarkedPaperIds.filter((id) => id !== paperId)
              : [...state.bookmarkedPaperIds, paperId],
          };
        }),
      isBookmarked: (paperId: string) => get().bookmarkedPaperIds.includes(paperId),
    }),
    {
      name: 'padi-bookmarks',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
