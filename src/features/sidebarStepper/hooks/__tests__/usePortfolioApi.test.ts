import { renderHook, waitFor } from '@testing-library/react';
import { usePortfolioApi, usePortfolioDatabases, usePortfolioById, useSearchPortfolios } from '../usePortfolioApi';
import { portfolioService } from '@/services/portfolioService';
import { createWrapper } from '@/test/test-utils';

jest.mock('@/services/portfolioService');
const mockService = portfolioService as jest.Mocked<typeof portfolioService>;

describe('usePortfolioApi Hooks', () => {
    const wrapper = createWrapper();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('usePortfolioDatabases', () => {
        it('should fetch databases', async () => {
            const mockDBs = [{ id: '1', name: 'DB1' }];
            mockService.getDatabases.mockResolvedValue(mockDBs as any);

            const { result } = renderHook(() => usePortfolioDatabases(), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockDBs);
        });
    });

    describe('usePortfolioById', () => {
        it('should fetch database detail', async () => {
            const mockDB = { id: '1', name: 'DB1' };
            mockService.getDatabaseById.mockResolvedValue(mockDB as any);

            const { result } = renderHook(() => usePortfolioById('1'), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockDB);
        });
    });

    describe('useSearchPortfolios', () => {
        it('should search', async () => {
            const mockResults = [{ id: 'p1' }];
            mockService.searchPortfolios.mockResolvedValue(mockResults as any);

            const { result } = renderHook(() => useSearchPortfolios('query'), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockResults);
        });
    });

    describe('usePortfolioApi', () => {
        it('should return databases and helpers', async () => {
            const mockDBs = [{ id: '1', name: 'DB1' }];
            mockService.getDatabases.mockResolvedValue(mockDBs as any);

            const { result } = renderHook(() => usePortfolioApi(), { wrapper });

            await waitFor(() => expect(result.current.databases).toEqual(mockDBs));
        });

        it('should search via helper', async () => {
            const mockResults = [{ id: 'p1' }];
            mockService.searchPortfolios.mockResolvedValue(mockResults as any);

            const { result } = renderHook(() => usePortfolioApi(), { wrapper });
            const data = await result.current.searchPortfolios('query');

            expect(data).toEqual(mockResults);
        });

        it('should get detail via helper', async () => {
            const mockDB = { id: '1' };
            mockService.getDatabaseById.mockResolvedValue(mockDB as any);

            const { result } = renderHook(() => usePortfolioApi(), { wrapper });
            const data = await result.current.getDatabaseById('1');

            expect(data).toEqual(mockDB);
        });
    });
});
