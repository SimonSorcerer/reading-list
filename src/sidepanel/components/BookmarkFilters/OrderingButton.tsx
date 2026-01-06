import { useBookmarkStore } from '@/sidepanel/store/store';

interface OrderingButtonProps {
    sortField: 'savedAt' | 'title';
    label: string;
    ascSuffix: string;
    descSuffix: string;
    isActive?: boolean;
}

export const OrderingButton = ({
    sortField,
    label,
    ascSuffix,
    descSuffix,
    isActive = false,
}: OrderingButtonProps) => {
    const { sortBy, sortOrder, toggleSortOrder, setSortBy } = useBookmarkStore();

    const labelSuffix = sortBy === sortField ? (sortOrder === 'asc' ? ascSuffix : descSuffix) : '';

    const handleClick = () => {
        if (sortBy === sortField) {
            toggleSortOrder();
        }
        setSortBy(sortField);
    };

    const isActiveClass = isActive ? 'text-gray-800' : 'text-gray-400';

    return (
        <button
            onClick={handleClick}
            className={`font-bold hover:text-black text-nowrap ${isActiveClass}`}
        >
            {label} {labelSuffix}
        </button>
    );
};
