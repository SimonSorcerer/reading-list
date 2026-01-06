import { getRecentTabs, mapTabToBookmark } from '@/sidepanel/helpers/tabHelpers';
import { Bookmark } from '@/sidepanel/store/types';
import { useEffect, useState } from 'react';

export const useRecentlyClosedList = () => {
    const [recentList, setRecentList] = useState<Bookmark[]>([]);

    useEffect(() => {
        const fetchRecentTabs = async () => {
            const tabs = await getRecentTabs();
            const bookmarks = tabs.map((tab) => mapTabToBookmark(tab, ''));
            setRecentList(bookmarks);
        };

        fetchRecentTabs();

        chrome.sessions.onChanged.addListener(fetchRecentTabs);
        return () => {
            chrome.sessions.onChanged.removeListener(fetchRecentTabs);
        };
    }, []);

    return { recentList };
};
