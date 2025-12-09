/**
 * Helper to get environment variables that works in both Vite (import.meta.env)
 * and Jest (process.env) environments.
 */
export const getEnv = (key: string): string => {
    // Check for Vite environment
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key] || '';
    }

    // Fallback to process.env for Jest/Node
    // @ts-ignore - process is defined in Node environment
    return process.env[key] || '';
};

export const isDev = (): boolean => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.DEV;
    }
    // @ts-ignore
    return process.env.NODE_ENV === 'development';
};
