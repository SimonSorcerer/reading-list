import { getBookmarkDescription } from '@/sidepanel/helpers/summaryHelpers';
import { isUrlBookmarkable } from '@/sidepanel/helpers/urlHelpers';
import { create } from 'zustand';
import { config } from './config';
import { Bookmark, BookmarkState, BookmarkStore } from './types';
import { mapTabToBookmark } from '../helpers/tabHelpers';

export type { Bookmark, BookmarkState, BookmarkStore } from './types';
export type { SortBy, SortOrder } from './types';

interface StorageData {
    bookmarks: Bookmark[];
}

const INITIAL_STATE: BookmarkState = {
    bookmarks: [],
    sortBy: 'savedAt',
    sortOrder: 'desc',
    filterText: '',
    isLoading: false,
    error: null,
};

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
    ...INITIAL_STATE,

    loadBookmarks: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await config.chromeStorage.get<StorageData>(['bookmarks']);

            set({ bookmarks: data.bookmarks || [], isLoading: false, error: null });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to load bookmarks. Please try again.' });
        }
    },

    addBookmark: async (tab) => {
        const { bookmarks } = get();

        if (!isUrlBookmarkable(tab.url)) {
            return false;
        }

        if (bookmarks.find((b) => b.url === tab.url)) {
            return false;
        }

        set({ isLoading: true, error: null });

        const description = await getBookmarkDescription(tab.id);
        const updatedBookmarks = [...bookmarks, mapTabToBookmark(tab, description)];

        try {
            await config.chromeStorage.set({ bookmarks: updatedBookmarks });
            set({ bookmarks: updatedBookmarks, filterText: '', error: null, isLoading: false });
            return true;
        } catch (error) {
            set({ error: 'Failed to save bookmark. Please try again.', isLoading: false });
            return false;
        }
    },

    removeBookmark: async (id) => {
        const { bookmarks } = get();
        set({ isLoading: true, error: null });
        const updatedBookmarks = bookmarks.filter((b) => b.id !== id);

        try {
            await config.chromeStorage.set({ bookmarks: updatedBookmarks });
            set({ bookmarks: updatedBookmarks, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to remove bookmark. Please try again.', isLoading: false });
        }
    },

    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (order) => set({ sortOrder: order }),
    toggleSortOrder: () => {
        const { sortOrder } = get();
        set({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
    },
    setFilterText: (text) => set({ filterText: text }),
    clearError: () => set({ error: null }),

    getFilteredBookmarks: () => {
        const { bookmarks, sortBy, sortOrder, filterText } = get();

        let filtered = [...bookmarks];

        if (filterText) {
            const lower = filterText.toLowerCase();
            filtered = filtered.filter(
                (b) => b.title.toLowerCase().includes(lower) || b.url.toLowerCase().includes(lower)
            );
        }

        filtered.sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;

            if (sortBy === 'savedAt') {
                const aTime = a.savedAt ? new Date(a.savedAt).getTime() : 0;
                const bTime = b.savedAt ? new Date(b.savedAt).getTime() : 0;
                return multiplier * (aTime - bTime);
            }

            return multiplier * a.title.localeCompare(b.title);
        });

        return filtered;
    },

    isBookmarkSaved: (url: string | undefined) => {
        return url ? get().bookmarks.some((b) => b.url === url) : false;
    },
}));
