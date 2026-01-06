jest.mock('../store/config', () => ({
    config: {
        maxRecentTabs: 3,
    },
}));

const mockChrome = {
    tabs: {
        query: jest.fn(),
        get: jest.fn(),
    },
    sessions: {
        getRecentlyClosed: jest.fn(),
    },
};

(global as unknown as { chrome: typeof mockChrome }).chrome = mockChrome;

import { getCurrentTab, getTabById, getRecentTabs, mapTabToBookmark } from './tabHelpers';

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

describe('getRecentTabs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns tabs from recently closed sessions', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://first.com', title: 'First' } },
            { tab: { id: 2, url: 'https://second.com', title: 'Second' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs();

        expect(mockChrome.sessions.getRecentlyClosed).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(mockSessions[0].tab);
        expect(result[1]).toEqual(mockSessions[1].tab);
    });

    it('filters out sessions without tabs (windows only)', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://example.com', title: 'Tab' } },
            { window: { id: 100 } }, // window session, no tab
            { tab: { id: 2, url: 'https://another.com', title: 'Another' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs();

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
    });

    it('limits results to specified limit', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://first.com' } },
            { tab: { id: 2, url: 'https://second.com' } },
            { tab: { id: 3, url: 'https://third.com' } },
            { tab: { id: 4, url: 'https://fourth.com' } },
            { tab: { id: 5, url: 'https://fifth.com' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs(2);

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
    });

    it('uses default limit from config when not specified', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://first.com' } },
            { tab: { id: 2, url: 'https://second.com' } },
            { tab: { id: 3, url: 'https://third.com' } },
            { tab: { id: 4, url: 'https://fourth.com' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs(); // default is 3 from config

        expect(result).toHaveLength(3);
    });

    it('returns empty array when no sessions exist', async () => {
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue([]);

        const result = await getRecentTabs();

        expect(result).toEqual([]);
    });

    it('filters out duplicate URLs keeping first occurrence', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://example.com', title: 'First visit' } },
            { tab: { id: 2, url: 'https://other.com', title: 'Other' } },
            { tab: { id: 3, url: 'https://example.com', title: 'Second visit' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs(10);

        expect(result).toHaveLength(2);
        expect(result[0].url).toBe('https://example.com');
        expect(result[0].title).toBe('First visit'); // keeps first occurrence
        expect(result[1].url).toBe('https://other.com');
    });

    it('filters out tabs with empty URLs', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://example.com', title: 'Valid' } },
            { tab: { id: 2, url: '', title: 'Empty URL' } },
            { tab: { id: 3, url: 'https://another.com', title: 'Another' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs(10);

        expect(result).toHaveLength(2);
        expect(result[0].url).toBe('https://example.com');
        expect(result[1].url).toBe('https://another.com');
    });

    it('applies limit after deduplication', async () => {
        const mockSessions = [
            { tab: { id: 1, url: 'https://first.com' } },
            { tab: { id: 2, url: 'https://first.com' } }, // duplicate
            { tab: { id: 3, url: 'https://second.com' } },
            { tab: { id: 4, url: 'https://third.com' } },
            { tab: { id: 5, url: 'https://fourth.com' } },
        ];
        mockChrome.sessions.getRecentlyClosed.mockResolvedValue(mockSessions);

        const result = await getRecentTabs(3);

        expect(result).toHaveLength(3);
        expect(result.map((t) => t.url)).toEqual([
            'https://first.com',
            'https://second.com',
            'https://third.com',
        ]);
    });
});

describe('mapTabToBookmark', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-01-06T12:00:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('maps a tab with all properties to a bookmark', () => {
        const tab: Partial<chrome.tabs.Tab> = {
            title: 'Example Page',
            url: 'https://example.com/page',
            favIconUrl: 'https://example.com/favicon.ico',
        };

        const result = mapTabToBookmark(tab as chrome.tabs.Tab, 'A description');

        expect(result.title).toBe('Example Page');
        expect(result.url).toBe('https://example.com/page');
        expect(result.description).toBe('A description');
        expect(result.favIconUrl).toBe('https://example.com/favicon.ico');
        expect(result.savedAt).toBe('2026-01-06T12:00:00.000Z');
        expect(result.id).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('handles missing title with empty string', () => {
        const tab: Partial<chrome.tabs.Tab> = {
            url: 'https://example.com',
        };

        const result = mapTabToBookmark(tab as chrome.tabs.Tab, 'desc');

        expect(result.title).toBe('');
    });

    it('handles missing url with empty string', () => {
        const tab: Partial<chrome.tabs.Tab> = {
            title: 'Title',
        };

        const result = mapTabToBookmark(tab as chrome.tabs.Tab, 'desc');

        expect(result.url).toBe('');
    });

    it('handles missing favIconUrl with empty string', () => {
        const tab: Partial<chrome.tabs.Tab> = {
            title: 'Title',
            url: 'https://example.com',
        };

        const result = mapTabToBookmark(tab as chrome.tabs.Tab, 'desc');

        expect(result.favIconUrl).toBe('');
    });

    it('generates unique ids for different calls', () => {
        const tab: Partial<chrome.tabs.Tab> = {
            title: 'Title',
            url: 'https://example.com',
        };

        jest.setSystemTime(new Date('2026-01-06T12:00:00.000Z'));
        const result1 = mapTabToBookmark(tab as chrome.tabs.Tab, 'desc');

        jest.setSystemTime(new Date('2026-01-06T12:00:00.001Z'));
        const result2 = mapTabToBookmark(tab as chrome.tabs.Tab, 'desc');

        expect(result1.id).not.toBe(result2.id);
    });

    it('uses provided description as-is', () => {
        const tab: Partial<chrome.tabs.Tab> = {
            title: 'Title',
            url: 'https://example.com',
        };

        const result = mapTabToBookmark(tab as chrome.tabs.Tab, '');

        expect(result.description).toBe('');
    });
});
