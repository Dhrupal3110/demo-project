import { renderHook, waitFor, act } from '@testing-library/react';
import { usePortfolioPerilCoverageApi } from '../usePortfolioPerilCoverageApi';
import { portfolioPerilCoverageService } from '@/services/portfolioPerilCoverageService';

jest.mock('@/services/portfolioPerilCoverageService');
const mockService = portfolioPerilCoverageService as jest.Mocked<typeof portfolioPerilCoverageService>;

describe('usePortfolioPerilCoverageApi Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        const mockItems = [{ id: '1' }];
        mockService.getPortfolioPerils.mockResolvedValue(mockItems as any);

        const { result } = renderHook(() => usePortfolioPerilCoverageApi());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.items).toEqual(mockItems);
        expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
        mockService.getPortfolioPerils.mockRejectedValue(new Error('Fail'));

        const { result } = renderHook(() => usePortfolioPerilCoverageApi());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to fetch portfolio perils');
    });

    it('should update item', async () => {
        const mockItems = [{ id: '1', database: 'old' }];
        mockService.getPortfolioPerils.mockResolvedValue(mockItems as any);
        const { result } = renderHook(() => usePortfolioPerilCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.updatePortfolioPeril.mockResolvedValue({ id: '1', database: 'new' } as any);

        await act(async () => {
            await result.current.updatePortfolioPeril('1', { database: 'new' } as any);
        });

        expect(mockService.updatePortfolioPeril).toHaveBeenCalledWith('1', { database: 'new' });
        expect(result.current.items[0].database).toBe('new');
    });

    it('should handle update error', async () => {
        mockService.getPortfolioPerils.mockResolvedValue([]);
        const { result } = renderHook(() => usePortfolioPerilCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.updatePortfolioPeril.mockRejectedValue(new Error('Fail'));

        await act(async () => {
            const res = await result.current.updatePortfolioPeril('1', {});
            expect(res).toBeUndefined();
        });

        expect(result.current.error).toBe('Failed to update portfolio peril');
    });

    it('should search items', async () => {
        mockService.searchPortfolioPerils.mockResolvedValue([{ id: '1' } as any]);
        const { result } = renderHook(() => usePortfolioPerilCoverageApi());

        const data = await result.current.searchPortfolioPerils('query');
        expect(data).toEqual([{ id: '1' }]);
    });

    it('should handle search error', async () => {
        mockService.searchPortfolioPerils.mockImplementation(() => Promise.reject(new Error('Fail')));
        const { result } = renderHook(() => usePortfolioPerilCoverageApi());

        await act(async () => {
            await result.current.searchPortfolioPerils('query');
        });

        await waitFor(() => expect(result.current.error).toBe('Failed to search portfolio perils'));
    });

    it('should bulk update', async () => {
        const updatedItems = [{ id: '1', updated: true }];
        mockService.bulkUpdatePerilCoverage.mockResolvedValue(updatedItems as any);

        const { result } = renderHook(() => usePortfolioPerilCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.bulkUpdatePerilCoverage([]);
        });

        expect(result.current.items).toEqual(updatedItems);
    });

    it('should handle bulk update error', async () => {
        mockService.bulkUpdatePerilCoverage.mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => usePortfolioPerilCoverageApi());

        await act(async () => {
            const res = await result.current.bulkUpdatePerilCoverage([]);
            expect(res).toEqual([]);
        });

        expect(result.current.error).toBe('Failed to bulk update peril coverage');
    });
});
