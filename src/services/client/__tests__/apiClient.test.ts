import axios from 'axios';

// Mock API Config
jest.mock('../../config/apiConfig', () => ({
    API_CONFIG: {
        baseURL: 'http://test-api.com',
        timeout: 1000,
        enableLogging: true,
    },
}));

// Mock Axios
jest.mock('axios', () => {
    const mockInterceptors = {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    };

    const mockInstance = {
        interceptors: mockInterceptors,
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    };

    return {
        create: jest.fn(() => mockInstance),
        _mockInstance: mockInstance,
        _mockInterceptors: mockInterceptors,
    };
});

// Mock navigation
jest.mock('@/utils/navigation', () => ({
    navigateTo: jest.fn(),
}));

import { navigateTo } from '@/utils/navigation';
import { apiClient } from '../apiClient';

describe('apiClient', () => {
    const mockAxiosInstance = (axios as any)._mockInstance;
    const mockInterceptors = (axios as any)._mockInterceptors;

    let requestInterceptor: any;
    let requestErrorInterceptor: any;
    let responseInterceptor: any;
    let responseErrorInterceptor: any;

    beforeAll(() => {
        requestInterceptor = mockInterceptors.request.use.mock.calls[0][0];
        requestErrorInterceptor = mockInterceptors.request.use.mock.calls[0][1];
        responseInterceptor = mockInterceptors.response.use.mock.calls[0][0];
        responseErrorInterceptor = mockInterceptors.response.use.mock.calls[0][1];
    });

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });

    describe('HTTP methods', () => {
        it('calls get method correctly', async () => {
            mockAxiosInstance.get.mockResolvedValue({ data: 'test' });
            const result = await apiClient.get('/test');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
            expect(result).toEqual({ data: 'test' });
        });

        it('calls post method correctly', async () => {
            mockAxiosInstance.post.mockResolvedValue({ data: 'test' });
            const data = { id: 1 };
            const result = await apiClient.post('/test', data);
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', data, undefined);
            expect(result).toEqual({ data: 'test' });
        });

        it('calls put method correctly', async () => {
            mockAxiosInstance.put.mockResolvedValue({ data: 'test' });
            const data = { id: 1 };
            const result = await apiClient.put('/test', data);
            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', data, undefined);
            expect(result).toEqual({ data: 'test' });
        });

        it('calls patch method correctly', async () => {
            mockAxiosInstance.patch.mockResolvedValue({ data: 'test' });
            const data = { id: 1 };
            const result = await apiClient.patch('/test', data);
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test', data, undefined);
            expect(result).toEqual({ data: 'test' });
        });

        it('calls delete method correctly', async () => {
            mockAxiosInstance.delete.mockResolvedValue({ data: 'test' });
            const result = await apiClient.delete('/test');
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test', undefined);
            expect(result).toEqual({ data: 'test' });
        });
    });

    describe('Interceptors', () => {
        it('registers interceptors', () => {
            // We can't check toHaveBeenCalled because we clear mocks in beforeEach
            // But if we captured them in beforeAll, they were registered.
            expect(requestInterceptor).toBeDefined();
            expect(responseInterceptor).toBeDefined();
        });

        describe('Request Interceptor', () => {
            it('adds auth token to request if available', () => {
                localStorage.setItem('authToken', 'test-token');
                const config = { headers: {} };
                const result = requestInterceptor(config);
                expect(result.headers.Authorization).toBe('Bearer test-token');
            });

            it('does not add auth token if not available', () => {
                const config = { headers: {} };
                const result = requestInterceptor(config);
                expect(result.headers.Authorization).toBeUndefined();
            });

            it('logs request if logging enabled', () => {
                const config = { method: 'get', url: '/test', headers: {} };
                requestInterceptor(config);
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining('API Request'), expect.any(Object));
            });

            it('handles request error', async () => {
                const error = new Error('Request failed');
                await expect(requestErrorInterceptor(error)).rejects.toThrow('Request failed');
                expect(console.error).toHaveBeenCalledWith('Request Error:', error);
            });
        });

        describe('Response Interceptor', () => {
            it('returns response data and logs', () => {
                const response = { config: { url: '/test' }, status: 200, data: { result: 'ok' } };
                const result = responseInterceptor(response);
                expect(result).toEqual({ result: 'ok' });
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining('API Response'), expect.any(Object));
            });

            it('handles 401 error by clearing token and redirecting', async () => {
                const error = {
                    response: { status: 401, data: { message: 'Unauthorized' } },
                    config: { url: '/test' },
                };

                localStorage.setItem('authToken', 'old-token');

                try {
                    await responseErrorInterceptor(error);
                } catch (e) {
                    // Expected to reject
                }

                expect(localStorage.getItem('authToken')).toBeNull();
                expect(navigateTo).toHaveBeenCalledWith('/login');
            });

            it('handles 403 error', async () => {
                const error = { response: { status: 403 }, config: { url: '/test' } };
                try { await responseErrorInterceptor(error); } catch (e) { }
                expect(console.error).toHaveBeenCalledWith('Access forbidden');
            });

            it('handles 404 error', async () => {
                const error = { response: { status: 404 }, config: { url: '/test' } };
                try { await responseErrorInterceptor(error); } catch (e) { }
                expect(console.error).toHaveBeenCalledWith('Resource not found');
            });

            it('handles 500 error', async () => {
                const error = { response: { status: 500 }, config: { url: '/test' } };
                try { await responseErrorInterceptor(error); } catch (e) { }
                expect(console.error).toHaveBeenCalledWith('Server error');
            });

            it('handles network error (no response)', async () => {
                const error = { request: {}, message: 'Network Error' };
                try { await responseErrorInterceptor(error); } catch (e) { }
                expect(console.error).toHaveBeenCalledWith('Network Error:', 'Network Error');
            });

            it('handles generic error', async () => {
                const error = { message: 'Generic Error' };
                try { await responseErrorInterceptor(error); } catch (e) { }
                expect(console.error).toHaveBeenCalledWith('Error:', 'Generic Error');
            });
        });
    });
});
