import { BookmarkItem } from '../BookmarkList/BookmarkItem';
import { useRecentlyClosedList } from './useRecentlyClosedList';

export const RecentlyClosedList = () => {
    const { recentList } = useRecentlyClosedList();

    return (
        <>
            <h2 className="font-semibold my-2 pb-1 border-b border-gray-500">
                Recently Closed Tabs (last {recentList.length})
            </h2>
            {recentList.map((bookmark) => (
                <BookmarkItem key={bookmark.url} bookmark={bookmark} canBeDeleted={false} />
            ))}
        </>
    );
};
