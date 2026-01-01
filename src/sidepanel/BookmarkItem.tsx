import React from 'react';
import { useBookmarkStore, type Bookmark } from './store/store';
import { extractDomain } from './helpers/urlHelpers';
import { DeleteButton } from './icons/DeleteButton';

interface BookmarkItemProps {
    bookmark: Bookmark;
}

export const BookmarkItem = ({ bookmark }: BookmarkItemProps) => {
    const { removeBookmark } = useBookmarkStore();

    const handleNavigate = async () => {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (currentTab?.id) {
            await chrome.tabs.update(currentTab.id, { url: bookmark.url });
        }
    };

    const handleDelete = async () => {
        await removeBookmark(bookmark.id);
    };

    return (
        <li className="my-1 px-3 py-2 flex items-center hover:cursor-pointer hover:bg-gray-100 rounded-md">
            <img
                src={bookmark.favIconUrl}
                alt="Favicon"
                className="w-4 h-4 inline-block mr-2"
                onClick={handleNavigate}
            />
            <div className="ml-2 grow" onClick={handleNavigate}>
                <div className="font-bold text-base">{bookmark.title}</div>
                <div className="text-sm">{extractDomain(bookmark.url)}</div>
            </div>
            <DeleteButton onClick={handleDelete} className="ml-2" />
        </li>
    );
};
