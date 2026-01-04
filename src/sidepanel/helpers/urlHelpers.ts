const DOMAIN_REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/;
const BOOKMARKABLE_URL_REGEX = /^https?:\/\//i;

export const extractDomain = (url: string): string | null => {
    const match = url.match(DOMAIN_REGEX);
    return match ? match[1] : null;
};

// Only http:// and https:// URLs can be bookmarked in this extension. The check can be dropped if needed.
export const isUrlBookmarkable = (url: string | undefined): boolean => {
    return url ? BOOKMARKABLE_URL_REGEX.test(url) : false;
};
