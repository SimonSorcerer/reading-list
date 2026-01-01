const DOMAIN_REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/;

export const extractDomain = (url: string): string | null => {
    const match = url.match(DOMAIN_REGEX);
    return match ? match[1] : null;
};
