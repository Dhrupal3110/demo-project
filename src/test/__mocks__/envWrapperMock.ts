export const getEnv = (key: string): string => {
    return process.env[key] || '';
};

export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development';
};
