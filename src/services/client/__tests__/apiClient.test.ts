import axios from 'axios';
import { navigateTo } from '@/utils/navigation';
// Note: Imports are hoisted, but we'll define mocks below

// Mock API Config
jest.mock('../../config/apiConfig', () => ({
    API_CONFIG: {
        baseURL: 'http://test-api.com',
        timeout: 1000,
        enableLogging: true,
    },
}));

// Mock Auth Config
jest.mock('@/auth/authConfig', () => ({
    apiConfig: {
        scopes: ['api://test/scope']
    },
    msalConfig: {}
}));

// Mock MSAL Instance
const mockAcquireTokenSilent = jest.fn();
const mockGetActiveAccount = jest.fn();

jest.mock('@/auth/msalInstance', () => ({
    msalInstance: {
        getActiveAccount: () => mockGetActiveAccount(),
        acquireTokenSilent: (req: any) => mockAcquireTokenSilent(req),
    }
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
        mockGetActiveAccount.mockReturnValue(null);
        mockAcquireTokenSilent.mockReset();

        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });

    describe('HTTP methods', () => {
        // ... existing HTTP method tests ...
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
            expect(requestInterceptor).toBeDefined();
            expect(responseInterceptor).toBeDefined();
        });

        describe('Request Interceptor', () => {
            it('adds auth token to request if available (MSAL)', async () => {
                const mockAccount = { username: 'test@example.com' };
                mockGetActiveAccount.mockReturnValue(mockAccount);
                mockAcquireTokenSilent.mockResolvedValue({ accessToken: 'msal-access-token' });

                const config = { headers: {} };
                // Request interceptor is async now
                const result = await requestInterceptor(config);

                expect(mockAcquireTokenSilent).toHaveBeenCalledWith(expect.objectContaining({
                    account: mockAccount
                }));
                expect(result.headers.Authorization).toBe('Bearer msal-access-token');
            });

            it('does not add auth token if no active account', async () => {
                mockGetActiveAccount.mockReturnValue(null);

                const config = { headers: {} };
                const result = await requestInterceptor(config);

                expect(mockAcquireTokenSilent).not.toHaveBeenCalled();
                expect(result.headers.Authorization).toBeUndefined();
            });

            it('does not add auth token if silent acquisition fails', async () => {
                const mockAccount = { username: 'test@example.com' };
                mockGetActiveAccount.mockReturnValue(mockAccount);
                mockAcquireTokenSilent.mockRejectedValue(new Error('Silent auth failed'));

                const config = { headers: {} };
                const result = await requestInterceptor(config);

                expect(result.headers.Authorization).toBeUndefined();
                expect(console.error).toHaveBeenCalledWith('Token acquisition failed', expect.any(Error));
            });

            it('logs request if logging enabled', async () => {
                const config = { method: 'get', url: '/test', headers: {} };
                await requestInterceptor(config);
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining('API Request'), expect.any(Object));
            });
        });

        describe('Response Interceptor', () => {
            it('returns response data and logs', () => {
                const response = { config: { url: '/test' }, status: 200, data: { result: 'ok' } };
                const result = responseInterceptor(response);
                expect(result).toEqual({ result: 'ok' });
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining('API Response'), expect.any(Object));
            });

            it('handles 401 error by redirecting', async () => {
                const error = {
                    response: { status: 401, data: { message: 'Unauthorized' } },
                    config: { url: '/test' },
                };

                try {
                    await responseErrorInterceptor(error);
                } catch (e) {
                    // Expected to reject
                }

                // Removed localStorage check
                expect(navigateTo).toHaveBeenCalledWith('/login');
            });

            // ... other error handlers (403, 404, 500) ...
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
        });
    });
});
