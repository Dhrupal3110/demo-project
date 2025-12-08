export const API_CONFIG = {
    useDummyAPI: true,
    baseURL: 'http://localhost:3000/api',
    timeout: 30000,
    enableLogging: false,
    endpoints: {
        programs: '/programs',
        programsSearch: '/programs/search',
        programsRecent: '/programs/recent',
        programById: (id: string) => `/programs/${id}`,
    },
    retry: {
        maxRetries: 3,
        retryDelay: 1000,
    },
};

export const getApiConfig = () => API_CONFIG;
