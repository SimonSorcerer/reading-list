import { useBookmarkStore } from '../../store/store';

export const ErrorNotification = () => {
    const { error, clearError } = useBookmarkStore();

    if (!error) {
        return null;
    }

    return (
        <div
            className="flex items-center justify-between font-bold bg-rose-100 text-rose-800 pl-4 rounded mb-3"
            role="alert"
        >
            <span>{error}</span>
            <button
                className="ml-4 px-4 py-3 cursor-pointer hover:text-rose-950 hover:bg-rose-200"
                onClick={clearError}
                aria-label="Dismiss error"
            >
                close
            </button>
        </div>
    );
};
