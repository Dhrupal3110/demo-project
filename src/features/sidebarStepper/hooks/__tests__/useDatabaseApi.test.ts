import { renderHook, waitFor } from '@testing-library/react';
import {
    useAllDatabases,
    useSearchDatabases,
    useDatabaseById,
    useDatabasesByIds,
    useDatabaseStats,
    useDatabaseMutations
} from '../useDatabaseApi';
import { databaseService } from '@/services/databaseService';
import { createWrapper } from '@/test/test-utils';

// Mock the service
jest.mock('@/services/databaseService');

const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;

describe('useDatabaseApi Hooks', () => {
    const wrapper = createWrapper();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useAllDatabases', () => {
        it('should fetch all databases successfully when enabled', async () => {
            const mockData = {
                data: [{ id: '1', name: 'DB1' }],
                meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
            };
            mockDatabaseService.getAllDatabases.mockResolvedValue(mockData as any);

            const { result } = renderHook(() => useAllDatabases(true), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockData);
            expect(mockDatabaseService.getAllDatabases).toHaveBeenCalledTimes(1);
        });

        it('should not fetch when disabled', () => {
            const { result } = renderHook(() => useAllDatabases(false), { wrapper });
            expect(result.current.isFetching).toBe(false);
            expect(mockDatabaseService.getAllDatabases).not.toHaveBeenCalled();
        });
    });

    describe('useSearchDatabases', () => {
        it('should search databases when query is provided', async () => {
            const mockResult = [{ id: '1', name: 'Search Result' }];
            mockDatabaseService.searchDatabases.mockResolvedValue(mockResult as any);

            const { result } = renderHook(() => useSearchDatabases('query'), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockResult);
            expect(mockDatabaseService.searchDatabases).toHaveBeenCalledWith('query');
        });

        it('should not search when query is empty', () => {
            const { result } = renderHook(() => useSearchDatabases('  '), { wrapper });
            expect(result.current.isFetching).toBe(false);
            expect(mockDatabaseService.searchDatabases).not.toHaveBeenCalled();
        });
    });

    describe('useDatabaseById', () => {
        it('should fetch database details', async () => {
            const mockDB = { id: '1', name: 'Detail DB' };
            mockDatabaseService.getDatabaseById.mockResolvedValue(mockDB as any);

            const { result } = renderHook(() => useDatabaseById('1'), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockDB);
            expect(mockDatabaseService.getDatabaseById).toHaveBeenCalledWith('1');
        });
    });

    describe('useDatabasesByIds', () => {
        it('should fetch details for multiple ids', async () => {
            const mockDBs = [{ id: '1', name: 'DB1' }];
            mockDatabaseService.getDatabasesByIds.mockResolvedValue(mockDBs as any);

            const { result } = renderHook(() => useDatabasesByIds(['1']), { wrapper });

            await waitFor(() => expect(result.current.data).toEqual(mockDBs));
            expect(mockDatabaseService.getDatabasesByIds).toHaveBeenCalledWith(['1']);
        });
    });

    describe('useDatabaseStats', () => {
        it('should fetch status', async () => {
            const mockStats = { total: 10 };
            mockDatabaseService.getDatabaseStats.mockResolvedValue(mockStats as any);

            const { result } = renderHook(() => useDatabaseStats(true), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockStats);
        });
    });

    describe('useDatabaseMutations', () => {
        it('should create database', async () => {
            const { result } = renderHook(() => useDatabaseMutations(), { wrapper });
            mockDatabaseService.createDatabase.mockResolvedValue({ id: '1', name: 'New DB' } as any);

            await result.current.createDatabase.mutateAsync({ name: 'New DB' } as any);

            expect(mockDatabaseService.createDatabase).toHaveBeenCalledWith({ name: 'New DB' });
        });

        it('should update database', async () => {
            const { result } = renderHook(() => useDatabaseMutations(), { wrapper });
            mockDatabaseService.updateDatabase.mockResolvedValue({ id: '1', name: 'Updated DB' } as any);

            await result.current.updateDatabase.mutateAsync({ id: '1', updates: { name: 'Updated DB' } });

            expect(mockDatabaseService.updateDatabase).toHaveBeenCalledWith('1', { name: 'Updated DB' });
        });

        it('should delete database', async () => {
            const { result } = renderHook(() => useDatabaseMutations(), { wrapper });
            mockDatabaseService.deleteDatabase.mockResolvedValue(undefined);

            await result.current.deleteDatabase.mutateAsync('1');

            expect(mockDatabaseService.deleteDatabase).toHaveBeenCalledWith('1');
        });
    });
});
