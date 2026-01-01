import { type Bookmark } from '../store/store';

export const getCurrentBookmark = async (): Promise<Bookmark> => {
    const currentTab = (await chrome.tabs.query({ active: true, currentWindow: true }))?.[0];

    return {
        id: currentTab.id?.toString() || '',
        title: currentTab.title || '',
        url: currentTab.url || '',
        description: '',
        favIconUrl: currentTab.favIconUrl || '',
        savedAt: new Date().toISOString(),
    };
};
