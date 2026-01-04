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

        const handleTabUpdate = (
            _: number,
            changeInfo: chrome.tabs.OnUpdatedInfo,
            tab: chrome.tabs.Tab
        ) => {
            if (changeInfo.url && tab.active) {
                setCurrentTab(tab);
            }
        };

        // To get up-to-date tab info, we listen to both activated and updated events
        // to cover tab switches and URL changes (e.g., when navigating within the same tab)
        chrome.tabs.onActivated.addListener(handleTabChange);
        chrome.tabs.onUpdated.addListener(handleTabUpdate);

        return () => {
            chrome.tabs.onActivated.removeListener(handleTabChange);
            chrome.tabs.onUpdated.removeListener(handleTabUpdate);
        };
    }, []);

    return {
        currentTab,
        isBookmarkSaved: isBookmarkSaved(currentTab?.url),
    };
};
