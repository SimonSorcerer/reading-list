import { getCurrentTab, getTabById } from '@/sidepanel/helpers/tabHelpers';
import { useBookmarkStore } from '@/sidepanel/store/store';
import { useEffect, useState } from 'react';

export const useTabInfo = () => {
    const { isBookmarkSaved } = useBookmarkStore();

    const [currentTabUrl, setCurrentTabUrl] = useState<string | undefined>();

    useEffect(() => {
        getCurrentTab().then((tab) => setCurrentTabUrl(tab?.url));

        const handleTabChange = (info: chrome.tabs.OnActivatedInfo) => {
            getTabById(info.tabId).then((tab) => setCurrentTabUrl(tab?.url));
        };

        const handleTabUpdate = (
            _: number,
            changeInfo: chrome.tabs.OnUpdatedInfo,
            tab: chrome.tabs.Tab
        ) => {
            if (changeInfo.url && tab.active) {
                setCurrentTabUrl(changeInfo.url);
            }
        };

        // Listen to both activated and updated events to cover:
        // - Tab switches (onActivated)
        // - URL changes within the same tab (onUpdated)
        chrome.tabs.onActivated.addListener(handleTabChange);
        chrome.tabs.onUpdated.addListener(handleTabUpdate);

        return () => {
            chrome.tabs.onActivated.removeListener(handleTabChange);
            chrome.tabs.onUpdated.removeListener(handleTabUpdate);
        };
    }, []);

    return {
        currentTabUrl,
        isBookmarkSaved: isBookmarkSaved(currentTabUrl),
    };
};
