import { config } from '../store/config';
import { type Bookmark } from '../store/types';

export const getCurrentTab = async (): Promise<chrome.tabs.Tab | null> => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
};

export const getTabById = async (tabId: number): Promise<chrome.tabs.Tab | null> => {
    const tab = await chrome.tabs.get(tabId);
    return tab || null;
};

export const mapTabToBookmark = (tab: chrome.tabs.Tab, description: string): Bookmark => {
    return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: tab.title || '',
        url: tab.url || '',
        description,
        favIconUrl: tab.favIconUrl || '',
        savedAt: new Date().toISOString(),
    };
};

export const getRecentTabs = async (limit = config.maxRecentTabs): Promise<chrome.tabs.Tab[]> => {
    const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: 10 });
    const tabs: chrome.tabs.Tab[] = [];

    const isUniqueUrl = (tabUrl: string | undefined, collectedTabs: chrome.tabs.Tab[]) => {
        return tabUrl !== '' && !collectedTabs.some((t) => t.url === tabUrl);
    };

    for (const session of sessions) {
        if (tabs.length >= limit) break;
        if (session.tab && isUniqueUrl(session.tab.url, tabs)) {
            tabs.push(session.tab);
        }
    }

    return tabs;
};
