import { renderHook, waitFor } from '@testing-library/react';
import { useTreatiesApi, useTreatiesDatabases, useTreatiesByDatabase, useSearchTreaties } from '../useTreatiesApi';
import { treatiesService } from '@/services/treatiesService';
import { createWrapper } from '@/test/test-utils';

jest.mock('@/services/treatiesService');
const mockService = treatiesService as jest.Mocked<typeof treatiesService>;

describe('useTreatiesApi Hooks', () => {
    const wrapper = createWrapper();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useTreatiesDatabases', () => {
        it('should fetch databases', async () => {
            const mockDBs = [{ id: '1' }];
            mockService.getDatabases.mockResolvedValue(mockDBs as any);

            const { result } = renderHook(() => useTreatiesDatabases(), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockDBs);
        });
    });

    describe('useTreatiesByDatabase', () => {
        it('should fetch treaties', async () => {
            const mockTreaties = [{ id: 't1' }];
            mockService.getTreatiesByDatabase.mockResolvedValue(mockTreaties as any);

            const { result } = renderHook(() => useTreatiesByDatabase('1'), { wrapper });

            await waitFor(() => expect(mockService.getTreatiesByDatabase).toHaveBeenCalledWith('1'));
            await waitFor(() => expect(result.current.data).toEqual(mockTreaties));
        });
    });

    describe('useSearchTreaties', () => {
        it('should search treaties', async () => {
            const mockTreaties = [{ id: 't1' }];
            mockService.searchTreaties.mockResolvedValue(mockTreaties as any);

            const { result } = renderHook(() => useSearchTreaties('query'), { wrapper });

            await waitFor(() => expect(mockService.searchTreaties).toHaveBeenCalledWith('query'));
            await waitFor(() => expect(result.current.data).toEqual(mockTreaties));
        });
    });

    describe('useTreatiesApi', () => {
        it('should return databases and helpers', async () => {
            const mockDBs = [{ id: '1' }];
            mockService.getDatabases.mockResolvedValue(mockDBs as any);

            const { result } = renderHook(() => useTreatiesApi(), { wrapper });

            await waitFor(() => expect(result.current.databases).toEqual(mockDBs));
        });

        it('should get by database via helper', async () => {
            const mockTreaties = [{ id: 't1' }];
            mockService.getTreatiesByDatabase.mockResolvedValue(mockTreaties as any);

            const { result } = renderHook(() => useTreatiesApi(), { wrapper });
            const data = await result.current.getTreatiesByDatabase('1');

            expect(data).toEqual(mockTreaties);
        });

        it('should search via helper', async () => {
            const mockTreaties = [{ id: 't1' }];
            mockService.searchTreaties.mockResolvedValue(mockTreaties as any);

            const { result } = renderHook(() => useTreatiesApi(), { wrapper });
            const data = await result.current.searchTreaties('query');

            expect(data).toEqual(mockTreaties);
        });
    });
});
