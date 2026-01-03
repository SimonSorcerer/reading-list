import { useBookmarkStore } from '@/sidepanel/store/store';

interface SearchFieldProps {
    className?: string;
}

export const SearchField = ({ className = '' }: SearchFieldProps) => {
    const { filterText, setFilterText } = useBookmarkStore();

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    return (
        <input
            type="text"
            placeholder="Filter bookmarks..."
            value={filterText}
            onChange={handleTextChange}
            className={`p-2 border border-gray-300 rounded-md ${className ?? ''}`}
        />
    );
};
