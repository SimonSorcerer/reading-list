import { create } from 'zustand';

export type Bookmark = {
    id: string;
    title: string;
    url: string;
    description?: string;
    favIconUrl?: string;
    savedAt: string;
};

interface StorageData {
    bookmarks: Bookmark[];
}

type SortBy = 'savedAt' | 'title';
type SortOrder = 'asc' | 'desc';

interface BookmarkState {
    bookmarks: Bookmark[];
    sortBy: SortBy;
    sortOrder: SortOrder;
    filterText: string;
    isLoading: boolean;
    error: string | null;
}

interface BookmarkActions {
    loadBookmarks: () => Promise<void>;
    addBookmark: (bookmark: Omit<Bookmark, 'id'>) => Promise<boolean>;
    removeBookmark: (id: string) => Promise<void>;
    setSortBy: (sortBy: SortBy) => void;
    setSortOrder: (order: SortOrder) => void;
    toggleSortOrder: () => void;
    setFilterText: (text: string) => void;

    // Computed
    getFilteredBookmarks: () => Bookmark[];
    isBookmarkSaved: (url: string) => boolean;
}

type BookmarkStore = BookmarkState & BookmarkActions;

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
            const data = await chrome.storage.local.get<StorageData>(['bookmarks']);

            set({ bookmarks: data.bookmarks || [], isLoading: false, error: null });
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            set({ isLoading: false, error: (error as Error).message });
        }
    },

    addBookmark: async (bookmark) => {
        const { bookmarks } = get();

        // Check if already exists
        if (bookmarks.find((b) => b.url === bookmark.url)) {
            return false;
        }

        const newBookmark: Bookmark = {
            ...bookmark,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        const updatedBookmarks = [...bookmarks, newBookmark];

        try {
            await chrome.storage.local.set({ bookmarks: updatedBookmarks });
            set({ bookmarks: updatedBookmarks, error: null });
            return true;
        } catch (error) {
            console.error('Failed to save bookmark:', error);
            set({ error: (error as Error).message });
            return false;
        }
    },

    removeBookmark: async (id) => {
        const { bookmarks } = get();
        const updatedBookmarks = bookmarks.filter((b) => b.id !== id);

        try {
            await chrome.storage.local.set({ bookmarks: updatedBookmarks });
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
                (b) =>
                    b.title.toLowerCase().includes(lower) ||
                    b.url.toLowerCase().includes(lower) ||
                    b.description?.toLowerCase().includes(lower)
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

    isBookmarkSaved: (url) => {
        return get().bookmarks.some((b) => b.url === url);
    },
}));
