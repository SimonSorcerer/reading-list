import { getCurrentTab, getTabById } from '@/sidepanel/helpers/tabHelpers';
import { useBookmarkStore } from '@/sidepanel/store/store';
import { useEffect, useState } from 'react';

export const useTabInfo = () => {
    const { isBookmarkSaved } = useBookmarkStore();

    const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

    useEffect(() => {
        getCurrentTab().then(setCurrentTab);

        const handleTabChange = (info: chrome.tabs.OnActivatedInfo) => {
            getTabById(info.tabId).then(setCurrentTab);
        };

        chrome.tabs.onActivated.addListener(handleTabChange);

        return () => {
            chrome.tabs.onActivated.removeListener(handleTabChange);
        };
    }, []);

    return {
        currentTab,
        isBookmarkSaved: isBookmarkSaved(currentTab?.url),
    };
};
