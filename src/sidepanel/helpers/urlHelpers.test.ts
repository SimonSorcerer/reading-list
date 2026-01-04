import { extractDomain, isUrlBookmarkable } from './urlHelpers';

describe('extractDomain', () => {
    it('extracts domain from a simple https URL', () => {
        expect(extractDomain('https://example.com')).toBe('example.com');
    });

    it('extracts domain from URL with www prefix', () => {
        expect(extractDomain('https://www.example.com')).toBe('example.com');
    });

    it('extracts domain from URL with path', () => {
        expect(extractDomain('https://example.com/path/to/page')).toBe('example.com');
    });

    it('extracts domain from URL with query params', () => {
        expect(extractDomain('https://example.com?query=param')).toBe('example.com');
    });

    it('extracts domain from URL with port', () => {
        expect(extractDomain('https://example.com:8080/page')).toBe('example.com');
    });

    it('extracts domain from http URL', () => {
        expect(extractDomain('http://example.com')).toBe('example.com');
    });

    it('extracts subdomain correctly', () => {
        expect(extractDomain('https://blog.example.com')).toBe('blog.example.com');
    });

    it('returns null for invalid URL', () => {
        expect(extractDomain('')).toBeNull();
    });
});

describe('isUrlBookmarkable', () => {
    it('returns true for https URLs', () => {
        expect(isUrlBookmarkable('https://example.com')).toBe(true);
    });

    it('returns true for http URLs', () => {
        expect(isUrlBookmarkable('http://example.com')).toBe(true);
    });

    it('returns false for chrome:// URLs', () => {
        expect(isUrlBookmarkable('chrome://settings')).toBe(false);
    });

    it('returns false for chrome-extension:// URLs', () => {
        expect(isUrlBookmarkable('chrome-extension://abc123/page.html')).toBe(false);
    });

    it('returns false for file:// URLs', () => {
        expect(isUrlBookmarkable('file:///path/to/file.html')).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isUrlBookmarkable(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(isUrlBookmarkable('')).toBe(false);
    });

    it('is case insensitive for protocol', () => {
        expect(isUrlBookmarkable('HTTPS://example.com')).toBe(true);
        expect(isUrlBookmarkable('HTTP://example.com')).toBe(true);
    });
});
