import { formatDistanceToNow } from 'date-fns';
import { useBookmarkStore, type Bookmark } from '../../store/store';
import { extractDomain } from '../../helpers/urlHelpers';
import { DeleteButton } from './DeleteButton';

interface BookmarkItemProps {
    bookmark: Bookmark;
}

export const BookmarkItem = ({ bookmark }: BookmarkItemProps) => {
    const { removeBookmark } = useBookmarkStore();

    const handleNavigate = async () => {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (currentTab?.id) {
            await chrome.tabs.update(currentTab.id, { url: bookmark.url });
        }
    };

    const handleDelete = async () => {
        await removeBookmark(bookmark.id);
    };

    return (
        <li className="my-1 px-3 py-2 flex items-center hover:cursor-pointer hover:bg-gray-200 rounded-md">
            <div className="p-4 mr-2 bg-gray-100 rounded-lg shrink-0">
                <img
                    src={bookmark.favIconUrl}
                    alt="Favicon"
                    className="w-4 h-4 inline-block"
                    onClick={handleNavigate}
                />
            </div>
            <div className="ml-2 grow" onClick={handleNavigate}>
                <div className="font-bold text-base">{bookmark.title}</div>
                <div className="text-sm text-gray-600 flex gap-2">
                    <div>{extractDomain(bookmark.url)}</div>
                    <div>•</div>
                    <div>
                        {formatDistanceToNow(new Date(bookmark.savedAt), { addSuffix: true })}
                    </div>
                </div>
            </div>
            <DeleteButton onClick={handleDelete} className="ml-2" />
        </li>
    );
};
