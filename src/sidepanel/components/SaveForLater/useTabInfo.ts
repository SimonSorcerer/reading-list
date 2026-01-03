import { getCurrentTab, getTabById } from '@/sidepanel/helpers/tabHelpers';
import { Bookmark, useBookmarkStore } from '@/sidepanel/store/store';
import { useEffect, useState } from 'react';

export const useTabInfo = () => {
    const { isBookmarkSaved } = useBookmarkStore();

    const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

    useEffect(() => {
        getCurrentTab().then((tab) => {
            setCurrentTab(tab);
        });

        const handleTabChange = (info: chrome.tabs.OnActivatedInfo) => {
            getTabById(info.tabId).then((tab) => {
                setCurrentTab(tab);
            });
        };

        // Listen for tab changes
        chrome.tabs.onActivated.addListener(handleTabChange);

        return () => {
            chrome.tabs.onActivated.removeListener(handleTabChange);
        };
    }, []);

    const mapTabToBook = (tab: chrome.tabs.Tab): Bookmark => {
        return {
            id: tab.id?.toString() || '',
            title: tab.title || '',
            url: tab.url || '',
            description: '',
            favIconUrl: tab.favIconUrl || '',
            savedAt: new Date().toISOString(),
        };
    };

    return {
        currentBookmark: currentTab ? mapTabToBook(currentTab) : null,
        isBookmarkSaved: isBookmarkSaved(currentTab?.url),
    };
};
