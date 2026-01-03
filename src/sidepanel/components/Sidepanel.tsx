import { SaveForLater } from './SaveForLater/SaveForLater';
import { BookmarkList } from './BookmarkList/BookmarkList';
import { BookmarkFilters } from './BookmarkFilters/BookmarkFilters';

export const Sidepanel = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Reading List</h1>
            <SaveForLater />
            <BookmarkFilters />
            <hr />
            <BookmarkList />
        </div>
    );
};
