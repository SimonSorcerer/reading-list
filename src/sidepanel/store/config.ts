const chromeStorageType = 'local';

// Set to true to easily test error handling
const SIMULATE_ERRORS = false;

const mockFailingStorage = {
    get: async () => {
        throw new Error('Simulated storage read error');
    },
    set: async () => {
        throw new Error('Simulated storage write error');
    },
};

export const config = {
    maxRecentTabs: 3,
    maxDescriptionLength: 100,
    noDescriptionMessage: '(No description available)',
    useSmartSummary: true, // Use simple summary (as per requirements) or slightly better extraction (smarter)
    chromeStorageType,
    chromeStorage: SIMULATE_ERRORS ? mockFailingStorage : chrome.storage[chromeStorageType],
};
