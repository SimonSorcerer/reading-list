import { useBookmarkStore } from '../../store/store';
import { getCurrentBookmark } from '../../helpers/tabHelpers';

export const SaveForLater = () => {
    const { addBookmark, isLoading } = useBookmarkStore();
    const label = isLoading ? 'Saving ...' : 'Save For Later';

    const handleClick = async () => {
        const newBookmark = await getCurrentBookmark();
        await addBookmark(newBookmark);
    };

    return (
        <div>
            <button
                className="border rounded-sm px-2 py-1 border-x-gray-400 font-bold cursor-pointer hover:bg-gray-200"
                type="button"
                onClick={handleClick}
            >
                {label}
            </button>
        </div>
    );
};
