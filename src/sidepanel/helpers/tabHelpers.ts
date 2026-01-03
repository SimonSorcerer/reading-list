export const getCurrentTab = async (): Promise<chrome.tabs.Tab | null> => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
};

export const getTabById = async (tabId: number): Promise<chrome.tabs.Tab | null> => {
    const tab = await chrome.tabs.get(tabId);
    return tab || null;
};
