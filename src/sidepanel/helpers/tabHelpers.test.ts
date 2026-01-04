import { getCurrentTab, getTabById } from './tabHelpers';

const mockChrome = {
    tabs: {
        query: jest.fn(),
        get: jest.fn(),
    },
};

(global as unknown as { chrome: typeof mockChrome }).chrome = mockChrome;

describe('getCurrentTab', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the active tab when one exists', async () => {
        const mockTab: Partial<chrome.tabs.Tab> = {
            id: 123,
            url: 'https://example.com',
            title: 'Example',
        };
        mockChrome.tabs.query.mockResolvedValue([mockTab]);

        const result = await getCurrentTab();

        expect(mockChrome.tabs.query).toHaveBeenCalledWith({
            active: true,
            currentWindow: true,
        });
        expect(result).toEqual(mockTab);
    });

    it('returns null when no active tab exists', async () => {
        mockChrome.tabs.query.mockResolvedValue([]);

        const result = await getCurrentTab();

        expect(result).toBeNull();
    });

    it('returns the first tab when multiple are returned', async () => {
        const mockTabs: Partial<chrome.tabs.Tab>[] = [
            { id: 1, url: 'https://first.com' },
            { id: 2, url: 'https://second.com' },
        ];
        mockChrome.tabs.query.mockResolvedValue(mockTabs);

        const result = await getCurrentTab();

        expect(result).toEqual(mockTabs[0]);
    });
});

describe('getTabById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the tab when it exists', async () => {
        const mockTab: Partial<chrome.tabs.Tab> = {
            id: 456,
            url: 'https://example.com',
            title: 'Example Tab',
        };
        mockChrome.tabs.get.mockResolvedValue(mockTab);

        const result = await getTabById(456);

        expect(mockChrome.tabs.get).toHaveBeenCalledWith(456);
        expect(result).toEqual(mockTab);
    });

    it('returns null when tab does not exist', async () => {
        mockChrome.tabs.get.mockResolvedValue(undefined);

        const result = await getTabById(999);

        expect(result).toBeNull();
    });
});
