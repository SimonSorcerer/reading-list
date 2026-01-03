import { useBookmarkStore } from '../../store/store';
import { useTabInfo } from './hooks/useTabInfo';

export const SaveForLater = () => {
    const { addBookmark } = useBookmarkStore();
    const { currentTab, isBookmarkSaved } = useTabInfo();
    const label = isBookmarkSaved ? 'Bookmark already saved' : 'Save For Later';

    const handleClick = async () => {
        if (!currentTab || isBookmarkSaved) {
            return;
        }
        await addBookmark(currentTab);
    };

    return (
        <div>
            <button
                className="w-full bg-sky-700 text-white rounded-md px-4 py-3 my-4 text-md font-bold cursor-pointer hover:bg-sky-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                type="button"
                onClick={handleClick}
                disabled={isBookmarkSaved}
            >
                {label}
            </button>
        </div>
    );
};
