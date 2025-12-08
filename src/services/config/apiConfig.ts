// ============= api/config/apiConfig.ts =============

export const API_CONFIG = {
  // Switch between dummy and real API
  useDummyAPI: true, // Set to false when real API is ready
  
  // Base URL for real API
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1',
  
  // Request timeout (ms)
  timeout: 30000,
  
  // Enable request/response logging
  enableLogging: import.meta.env.DEV,
  
  // API endpoints
  endpoints: {
    programs: '/programs',
    programsSearch: '/programs/search',
    programsRecent: '/programs/recent',
    programById: (id: string) => `/programs/${id}`,
  },
  
  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};

// Environment-specific configuration
export const getApiConfig = () => {
  const env = import.meta.env.MODE;
  
  const configs = {
    development: {
      ...API_CONFIG,
      baseURL: 'http://localhost:3000/api',
      enableLogging: true,
    },
    staging: {
      ...API_CONFIG,
      baseURL: 'https://staging-api.example.com/v1',
      enableLogging: true,
    },
    production: {
      ...API_CONFIG,
      baseURL: 'https://api.example.com/v1',
      enableLogging: false,
    },
  };
  
  return configs[env as keyof typeof configs] || API_CONFIG;
};