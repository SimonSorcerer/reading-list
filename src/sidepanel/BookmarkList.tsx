import React from 'react';
import { useBookmarkStore } from './store/store';
import { BookmarkItem } from './BookmarkItem';

export const BookmarkList = () => {
    const { getFilteredBookmarks } = useBookmarkStore();
    const bookmarks = getFilteredBookmarks();

    if (bookmarks.length === 0) {
        return <div>No bookmarks available.</div>;
    }

    return (
        <ul>
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.url} bookmark={bookmark} />
            ))}
        </ul>
    );
};
