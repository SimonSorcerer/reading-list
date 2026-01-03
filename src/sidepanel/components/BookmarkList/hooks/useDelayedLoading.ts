import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 150;

/**
 * Hook delays showing a loading state to avoid flashing for faster loads
 * Only returns true after the specified delay has passed while still loading
 */
export const useDelayedLoading = (isLoading: boolean, delayMs = DEFAULT_DELAY_MS): boolean => {
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => setShowLoading(true), delayMs);
            return () => clearTimeout(timer);
        } else {
            setShowLoading(false);
        }
    }, [isLoading, delayMs]);

    return showLoading;
};
