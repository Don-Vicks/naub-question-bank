import { create } from 'zustand';
import { get as idbGet, set as idbSet } from 'idb-keyval';

interface BookmarkState {
  bookmarkedIds: Set<string>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (questionId: string) => Promise<void>;
  isBookmarked: (questionId: string) => boolean;
}

const STORAGE_KEY = 'padi:bookmarks';

// Bookmarks live in IndexedDB (via idb-keyval), not localStorage - this is
// what makes the "download for offline" story in plan.md actually work:
// bookmarked question IDs and their cached content need to survive being
// fully offline, and IndexedDB is the right tool for that on mobile web.
export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedIds: new Set(),
  loaded: false,

  load: async () => {
    const stored = await idbGet<string[]>(STORAGE_KEY);
    set({ bookmarkedIds: new Set(stored ?? []), loaded: true });
  },

  toggle: async (questionId: string) => {
    const current = new Set(get().bookmarkedIds);
    if (current.has(questionId)) {
      current.delete(questionId);
    } else {
      current.add(questionId);
    }
    set({ bookmarkedIds: current });
    await idbSet(STORAGE_KEY, Array.from(current));
  },

  isBookmarked: (questionId: string) => get().bookmarkedIds.has(questionId),
}));
