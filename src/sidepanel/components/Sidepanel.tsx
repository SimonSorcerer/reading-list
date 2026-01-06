import { useEffect } from 'react';
import { useBookmarkStore } from '../store/store';
import { BookmarkFilters } from './BookmarkFilters/BookmarkFilters';
import { BookmarkList } from './BookmarkList/BookmarkList';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';
import { SaveForLater } from './SaveForLater/SaveForLater';
import { RecentlyClosedList } from './RecentlyClosed/RecentlyClosedList';

export const Sidepanel = () => {
    const { loadBookmarks } = useBookmarkStore();

    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    return (
        <div className="px-4 pb-2">
            <div className="sticky top-0 pt-2 bg-white">
                <ErrorNotification />
                <SaveForLater />
                <BookmarkFilters />
                <hr />
            </div>
            <BookmarkList />
            <RecentlyClosedList />
        </div>
    );
};
