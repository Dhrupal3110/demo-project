// ============= api/client/apiClient.ts =============
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/apiConfig';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
    this.client.interceptors.response.use(
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
              localStorage.removeItem('authToken');
              window.location.href = '/login';
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
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T, T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T, T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T, T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch<T, T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T, T>(url, config);
  }
}

export const apiClient = new ApiClient();