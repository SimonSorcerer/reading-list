import { getCurrentTab } from '@/sidepanel/helpers/tabHelpers';
import { isUrlBookmarkable } from '@/sidepanel/helpers/urlHelpers';
import { useBookmarkStore } from '../../store/store';
import { useTabInfo } from './hooks/useTabInfo';

export const SaveForLater = () => {
    const { addBookmark } = useBookmarkStore();
    const { currentTabUrl, isBookmarkSaved } = useTabInfo();

    const isBookmarkable = isUrlBookmarkable(currentTabUrl);
    const isDisabled = !isBookmarkable || isBookmarkSaved;

    const getLabel = () => {
        if (!isBookmarkable) return 'Bookmark not available';
        if (isBookmarkSaved) return 'Bookmark already saved';
        return 'Save For Later';
    };

    const handleClick = async () => {
        // No loading state needed here to avoid UI flickering and delays.
        // getCurrentTab is nearly instant, and the new bookmark addition is checked in the store action.
        const tab = await getCurrentTab();
        if (!tab || !isUrlBookmarkable(tab.url)) {
            return;
        }
        await addBookmark(tab);
    };

    return (
        <div>
            <button
                className="w-full bg-sky-700 text-white rounded-md px-4 py-3 my-4 text-md font-bold cursor-pointer hover:bg-sky-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                type="button"
                onClick={handleClick}
                disabled={isDisabled}
            >
                {getLabel()}
            </button>
        </div>
    );
};
