const chromeStorageType = 'local';

export const config = {
    sidepanelWidth: 300,
    chromeStorageType,
    chromeStorage: chrome.storage[chromeStorageType],
};
