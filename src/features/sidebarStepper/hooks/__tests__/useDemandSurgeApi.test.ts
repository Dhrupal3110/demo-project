import { renderHook, waitFor } from '@testing-library/react';
import { useDemandSurgeApi, useDemandSurgeItems } from '../useDemandSurgeApi';
import { demandSurgeService } from '@/services/demandSurgeService';
import { createWrapper } from '@/test/test-utils';

jest.mock('@/services/demandSurgeService');

const mockService = demandSurgeService as jest.Mocked<typeof demandSurgeService>;

describe('useDemandSurgeApi Hooks', () => {
    const wrapper = createWrapper();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useDemandSurgeItems', () => {
        it('should fetch items', async () => {
            const mockItems = [{ id: '1', demandSurge: true }];
            mockService.getDemandSurgeItems.mockResolvedValue(mockItems as any);

            const { result } = renderHook(() => useDemandSurgeItems(), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockItems);
        });
    });

    describe('useDemandSurgeApi', () => {
        it('should return items and helpers', async () => {
            const mockItems = [{ id: '1', demandSurge: true }];
            mockService.getDemandSurgeItems.mockResolvedValue(mockItems as any);

            const { result } = renderHook(() => useDemandSurgeApi(), { wrapper });

            await waitFor(() => expect(result.current.items).toEqual(mockItems));
            expect(result.current.loading).toBe(false);
        });

        it('should update item', async () => {
            mockService.updateDemandSurgeItem.mockResolvedValue({} as any);
            const { result } = renderHook(() => useDemandSurgeApi(), { wrapper });

            await result.current.updateDemandSurgeItem('1', { demandSurge: false });

            expect(mockService.updateDemandSurgeItem).toHaveBeenCalledWith('1', { demandSurge: false });
        });

        it('should search items', async () => {
            const mockResults = [{ id: '1' }];
            mockService.searchDemandSurgeItems.mockResolvedValue(mockResults as any);
            const { result } = renderHook(() => useDemandSurgeApi(), { wrapper });

            const data = await result.current.searchDemandSurgeItems('dbQuery', 'portQuery');
            expect(data).toEqual(mockResults);
            expect(mockService.searchDemandSurgeItems).toHaveBeenCalledWith('dbQuery', 'portQuery');
        });
    });
});
