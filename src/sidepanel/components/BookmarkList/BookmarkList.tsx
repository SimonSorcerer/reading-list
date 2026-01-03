import { useBookmarkStore } from '../../store/store';
import { BookmarkItem } from './BookmarkItem';
import { EmptyList } from './EmptyList';

export const BookmarkList = () => {
    const { getFilteredBookmarks } = useBookmarkStore();
    const bookmarks = getFilteredBookmarks();

    if (bookmarks.length === 0) {
        return <EmptyList />;
    }

    return (
        <ul>
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.url} bookmark={bookmark} />
            ))}
        </ul>
    );
};
