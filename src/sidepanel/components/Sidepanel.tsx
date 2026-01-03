import { SaveForLater } from './SaveForLater/SaveForLater';
import { BookmarkList } from './BookmarkList/BookmarkList';
import { BookmarkFilters } from './BookmarkFilters/BookmarkFilters';

export const Sidepanel = () => {
    return (
        <div className="p-4">
            <SaveForLater />
            <BookmarkFilters />
            <hr />
            <BookmarkList />
        </div>
    );
};
