import { useBookmarkStore } from '../../store/store';
import { BookmarkItem } from './BookmarkItem';
import { EmptyList } from './EmptyList';
import { SkeletonItem } from './SkeletonItem';
import { useDelayedLoading } from './hooks/useDelayedLoading';

export const BookmarkList = () => {
    const { getFilteredBookmarks, isLoading } = useBookmarkStore();
    const bookmarks = getFilteredBookmarks();
    const showLoading = useDelayedLoading(isLoading);

    if (bookmarks.length === 0 && !isLoading) {
        return <EmptyList />;
    }

    return (
        <>
            {showLoading && <SkeletonItem />}
            <ul>
                {bookmarks.map((bookmark) => (
                    <BookmarkItem key={bookmark.url} bookmark={bookmark} />
                ))}
            </ul>
        </>
    );
};
