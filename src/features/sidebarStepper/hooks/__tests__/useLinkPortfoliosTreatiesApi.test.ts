import { renderHook, waitFor, act } from '@testing-library/react';
import { useLinkPortfoliosTreatiesApi } from '../useLinkPortfoliosTreatiesApi';
import { linkPortfoliosTreatiesService } from '@/services/linkPortfoliosTreatiesService';

// Mock the service
jest.mock('@/services/linkPortfoliosTreatiesService');
const mockService = linkPortfoliosTreatiesService as jest.Mocked<typeof linkPortfoliosTreatiesService>;

describe('useLinkPortfoliosTreatiesApi Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        const mockData = {
            portfolios: [],
            treaties: [],
            linkedItems: [],
            databases: []
        };
        mockService.fetchLinkData.mockResolvedValue(mockData as any);

        const { result } = renderHook(() => useLinkPortfoliosTreatiesApi());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.linkData).toEqual(mockData);
        expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
        mockService.fetchLinkData.mockRejectedValue(new Error('Failed'));

        const { result } = renderHook(() => useLinkPortfoliosTreatiesApi());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to load data');
    });

    it('should add linked items', async () => {
        const mockData = {
            portfolios: [],
            treaties: [],
            linkedItems: [],
            databases: []
        };
        mockService.fetchLinkData.mockResolvedValue(mockData as any);

        const { result } = renderHook(() => useLinkPortfoliosTreatiesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const mockAddedItems = [{ id: '1', database: 'DB', portfolio: 'P1', treaty: 'T1' }];
        mockService.addLinkedItems.mockResolvedValue(mockAddedItems);

        await act(async () => {
            await result.current.addLinkedItems(
                'DB',
                [{ name: 'P1', id: 'p1', checked: true }],
                [{ name: 'T1', id: 't1', cedant: 'c', lob: 'l', checked: true }]
            );
        });

        expect(mockService.addLinkedItems).toHaveBeenCalled();
        // Verify state update (local optimistic or updated from result)
        expect(result.current.linkData?.linkedItems).toContainEqual(mockAddedItems[0]);
    });

    it('should not add duplicate items', async () => {
        const mockData = {
            portfolios: [],
            treaties: [],
            linkedItems: [{ id: '1', database: 'DB', portfolio: 'P1', treaty: 'T1' }],
            databases: []
        };
        mockService.fetchLinkData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => useLinkPortfoliosTreatiesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            const added = await result.current.addLinkedItems(
                'DB',
                [{ name: 'P1', id: 'p1', checked: true }],
                [{ name: 'T1', id: 't1', cedant: 'c', lob: 'l', checked: true }]
            );
            expect(added).toEqual([]);
        });

        expect(mockService.addLinkedItems).not.toHaveBeenCalled();
    });

    it('should remove linked item', async () => {
        const mockData = {
            portfolios: [],
            treaties: [],
            linkedItems: [{ id: '1', database: 'DB', portfolio: 'P1', treaty: 'T1' }],
            databases: []
        };
        mockService.fetchLinkData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => useLinkPortfoliosTreatiesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.removeLinkedItem.mockResolvedValue();

        await act(async () => {
            await result.current.removeLinkedItem('1');
        });

        expect(mockService.removeLinkedItem).toHaveBeenCalledWith('1');
        expect(result.current.linkData?.linkedItems.length).toBe(0);
    });
});
