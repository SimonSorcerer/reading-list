import { getPageSummary } from '@/sidepanel/helpers/summaryHelpers';
import { isUrlBookmarkable } from '@/sidepanel/helpers/urlHelpers';
import { create } from 'zustand';
import { config } from './config';
import { Bookmark, BookmarkState, BookmarkStore } from './types';

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
        set({ isLoading: true });
        try {
            const data = await config.chromeStorage.get<StorageData>(['bookmarks']);

            set({ bookmarks: data.bookmarks || [], isLoading: false, error: null });
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            set({ isLoading: false, error: (error as Error).message });
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
        set({ isLoading: true });

        let description = '';
        if (tab.id) {
            try {
                description = (await getPageSummary(tab.id)) || '';
            } catch {
                description = '(No description available)';
                // I guess description will be empty if we fail to get it
            }
        }

        const newBookmark: Bookmark = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: tab.title || '',
            url: tab.url || '',
            description,
            favIconUrl: tab.favIconUrl || '',
            savedAt: new Date().toISOString(),
        };

        const updatedBookmarks = [...bookmarks, newBookmark];

        try {
            await config.chromeStorage.set({ bookmarks: updatedBookmarks });
            set({ bookmarks: updatedBookmarks, filterText: '', error: null, isLoading: false });
            return true;
        } catch (error) {
            console.error('Failed to save bookmark:', error);
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    removeBookmark: async (id) => {
        const { bookmarks } = get();
        const updatedBookmarks = bookmarks.filter((b) => b.id !== id);

        try {
            await config.chromeStorage.set({ bookmarks: updatedBookmarks });
            set({ bookmarks: updatedBookmarks });
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        }
    },

    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (order) => set({ sortOrder: order }),
    toggleSortOrder: () => {
        const { sortOrder } = get();
        set({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
    },
    setFilterText: (text) => set({ filterText: text }),

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
                return multiplier * (new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
            }

            return multiplier * a.title.localeCompare(b.title);
        });

        return filtered;
    },

    isBookmarkSaved: (url: string | undefined) => {
        return url ? get().bookmarks.some((b) => b.url === url) : false;
    },
}));
