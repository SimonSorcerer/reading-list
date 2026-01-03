import { useBookmarkStore } from '@/sidepanel/store/store';
import { OrderingButton } from './OrderingButton';
import { SearchField } from './SearchField';

export const BookmarkFilters = () => {
    const { sortBy } = useBookmarkStore();

    return (
        <div className="my-2 flex gap-2 items-center text-md">
            <SearchField className="grow mr-4" />
            <div className="flex gap-2">
                <OrderingButton
                    sortField="title"
                    label="Title"
                    ascSuffix="[A-Z]"
                    descSuffix="[Z-A]"
                    isActive={sortBy === 'title'}
                />
                {' | '}
                <OrderingButton
                    sortField="savedAt"
                    label="Time added"
                    ascSuffix="[↑]"
                    descSuffix="[↓]"
                    isActive={sortBy === 'savedAt'}
                />
            </div>
        </div>
    );
};
