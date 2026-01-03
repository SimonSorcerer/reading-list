import { config } from '../store/config';

const getSimplePageSummary = async (tabId: number): Promise<string | undefined> => {
    const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: (maxLength: number) => {
            const pageText = document.body?.innerText
                ?.replace(/\s+/g, ' ')
                .trim()
                .substring(0, maxLength);

            if (pageText) {
                return pageText;
            }

            return (
                document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
            );
        },
        args: [config.maxDescriptionLength],
    });

    return results[0]?.result;
};

const getSmartPageSummary = async (tabId: number): Promise<string | undefined> => {
    const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: (maxLength: number) => {
            // First try Open Graph description
            const ogDesc = document
                .querySelector('meta[property="og:description"]')
                ?.getAttribute('content');
            if (ogDesc) return ogDesc.substring(0, maxLength);

            // Then Twitter description
            const twitterDesc = document
                .querySelector('meta[name="twitter:description"]')
                ?.getAttribute('content');
            if (twitterDesc) return twitterDesc.substring(0, maxLength);

            // Then standard meta description
            const metaDesc = document
                .querySelector('meta[name="description"]')
                ?.getAttribute('content');
            if (metaDesc) return metaDesc.substring(0, maxLength);

            // Then first paragraph in article/main content
            const article = document.querySelector('article, main, [role="main"]');
            const articleParagraph = article?.querySelector('p')?.innerText?.trim();
            if (articleParagraph && articleParagraph.length > 30) {
                return articleParagraph.substring(0, maxLength);
            }

            // Then fallback: first substantial paragraph anywhere
            const paragraphs = document.querySelectorAll('p');
            for (const p of paragraphs) {
                const text = p.innerText?.trim();
                if (text && text.length > 50) {
                    return text.substring(0, maxLength);
                }
            }

            // Body text last
            return (
                document.body?.innerText?.replace(/\s+/g, ' ').trim().substring(0, maxLength) || ''
            );
        },
        args: [config.maxDescriptionLength],
    });

    return results[0]?.result;
};

export const getPageSummary = async (tabId: number): Promise<string | undefined> => {
    if (config.useSmartSummary) {
        return getSmartPageSummary(tabId);
    } else {
        return getSimplePageSummary(tabId);
    }
};
