export type Bookmark = {
    id: string;
    title: string;
    url: string;
    description?: string;
    favIconUrl?: string;
    savedAt: string;
};

export type SortBy = 'savedAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface BookmarkState {
    bookmarks: Bookmark[];
    sortBy: SortBy;
    sortOrder: SortOrder;
    filterText: string;
    isLoading: boolean;
    error: string | null;
}

export interface BookmarkActions {
    loadBookmarks: () => Promise<void>;
    addBookmark: (tab: chrome.tabs.Tab) => Promise<boolean>;
    removeBookmark: (id: string) => Promise<void>;
    setSortBy: (sortBy: SortBy) => void;
    setSortOrder: (order: SortOrder) => void;
    toggleSortOrder: () => void;
    setFilterText: (text: string) => void;
    clearError: () => void;

    // Computed
    getFilteredBookmarks: () => Bookmark[];
    isBookmarkSaved: (url: string | undefined) => boolean;
}

export type BookmarkStore = BookmarkState & BookmarkActions;
