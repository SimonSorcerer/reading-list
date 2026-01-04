import { useEffect } from 'react';
import { useBookmarkStore } from '../store/store';
import { BookmarkFilters } from './BookmarkFilters/BookmarkFilters';
import { BookmarkList } from './BookmarkList/BookmarkList';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';
import { SaveForLater } from './SaveForLater/SaveForLater';

export const Sidepanel = () => {
    const { loadBookmarks } = useBookmarkStore();

    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    return (
        <div className="p-4">
            <ErrorNotification />
            <SaveForLater />
            <BookmarkFilters />
            <hr />
            <BookmarkList />
        </div>
    );
};
