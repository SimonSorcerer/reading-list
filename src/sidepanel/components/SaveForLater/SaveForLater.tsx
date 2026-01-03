import { useBookmarkStore } from '../../store/store';
import { useTabInfo } from './useTabInfo';

export const SaveForLater = () => {
    const { addBookmark } = useBookmarkStore();
    const { currentBookmark, isBookmarkSaved } = useTabInfo();
    const label = isBookmarkSaved ? 'Bookmark already saved' : 'Save For Later';

    const handleClick = async () => {
        console.log('Current Bookmark:', currentBookmark, 'Is Saved:', isBookmarkSaved);
        if (!currentBookmark || isBookmarkSaved) {
            return;
        }
        await addBookmark(currentBookmark);
    };

    return (
        <div>
            <button
                className="border rounded-sm px-4 py-2 my-4 text-md border-x-gray-400 font-bold cursor-pointer hover:bg-gray-200 disabled:text-gray-400"
                type="button"
                onClick={handleClick}
                disabled={isBookmarkSaved}
            >
                {label}
            </button>
        </div>
    );
};
