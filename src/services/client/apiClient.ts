// ============= api/client/apiClient.ts =============
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { navigateTo } from '@/utils/navigation';
import { msalInstance } from '@/auth/msalInstance';
import { apiConfig } from '@/auth/authConfig';

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const account = msalInstance.getActiveAccount();

      if (account) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            account: account,
            scopes: apiConfig.scopes
          });
          config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (error) {
          console.error('Token acquisition failed', error);
          // Provide no token, allow 401 response interceptor to handle it
        }
      }

      // Log request in development
      if (API_CONFIG.enableLogging) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      if (API_CONFIG.enableLogging) {
        console.log('✅ API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });
      }
      return response.data;
    },
    (error) => {
      if (error.response) {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status: error.response.status,
          message: error.response.data?.message || error.message,
        });

        // Handle specific error codes
        switch (error.response.status) {
          case 401:
            // Handle unauthorized
            // MSAL handles storage, so we assume session is invalid or expired
            // Optionally could trigger loginRedirect here if not handled elsewhere
            navigateTo('/login');
            break;
          case 403:
            console.error('Access forbidden');
            break;
          case 404:
            console.error('Resource not found');
            break;
          case 500:
            console.error('Server error');
            break;
        }
      } else if (error.request) {
        console.error('Network Error:', error.message);
      } else {
        console.error('Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get<T, T>(url, config);
  },

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post<T, T>(url, data, config);
  },

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put<T, T>(url, data, config);
  },

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.patch<T, T>(url, data, config);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete<T, T>(url, config);
  },
};