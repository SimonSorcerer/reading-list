const chromeStorageType = 'local';

export const config = {
    maxDescriptionLength: 100,
    useSmartSummary: true,
    chromeStorageType,
    chromeStorage: chrome.storage[chromeStorageType],
};
