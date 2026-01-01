import React from 'react';
import { useBookmarkStore } from './store/store';

interface OrderingButtonProps {
    sortField: 'savedAt' | 'title';
    label: string;
    ascSuffix: string;
    descSuffix: string;
}

const OrderingButton = ({ sortField, label, ascSuffix, descSuffix }: OrderingButtonProps) => {
    const { sortBy, sortOrder, toggleSortOrder, setSortBy } = useBookmarkStore();

    const labelSuffix = sortBy === sortField ? (sortOrder === 'asc' ? ascSuffix : descSuffix) : '';

    const handleClick = () => {
        if (sortBy === sortField) {
            toggleSortOrder();
        }
        setSortBy(sortField);
    };

    return (
        <button onClick={handleClick} className="hover:font-bold">
            {label} {labelSuffix}
        </button>
    );
};

export const BookmarkFilters = () => {
    return (
        <div className="my-2 flex gap-2 text-md">
            <OrderingButton sortField="title" label="Title" ascSuffix="[A-Z]" descSuffix="[Z-A]" />
            {' | '}
            <OrderingButton
                sortField="savedAt"
                label="Time added"
                ascSuffix="[↑]"
                descSuffix="[↓]"
            />
        </div>
    );
};
