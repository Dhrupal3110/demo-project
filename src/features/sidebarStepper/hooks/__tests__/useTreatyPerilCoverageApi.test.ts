import { renderHook, waitFor, act } from '@testing-library/react';
import { useTreatyPerilCoverageApi } from '../useTreatyPerilCoverageApi';
import { treatyPerilCoverageService } from '@/services/treatyPerilCoverageService';

jest.mock('@/services/treatyPerilCoverageService');
const mockService = treatyPerilCoverageService as jest.Mocked<typeof treatyPerilCoverageService>;

describe('useTreatyPerilCoverageApi Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        const mockData = [{ id: '1' }];
        mockService.getTreatyPerils.mockResolvedValue(mockData as any);

        const { result } = renderHook(() => useTreatyPerilCoverageApi());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.treatyPerils).toEqual(mockData);
    });

    it('should handle fetch error', async () => {
        mockService.getTreatyPerils.mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => useTreatyPerilCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to fetch treaty perils');
    });

    it('should update treaty peril', async () => {
        mockService.getTreatyPerils.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyPerilCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updated = { id: '1', updated: true };
        mockService.updateTreatyPeril.mockResolvedValue(updated as any);

        await act(async () => {
            const res = await result.current.updateTreatyPeril('1', {});
            expect(res).toEqual(updated);
        });
    });

    it('should handle update error', async () => {
        mockService.getTreatyPerils.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyPerilCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.updateTreatyPeril.mockRejectedValue(new Error('Fail'));

        await act(async () => {
            const res = await result.current.updateTreatyPeril('1', {});
            expect(res).toBeNull();
        });
        expect(result.current.error).toBe('Failed to update treaty peril');
    });

    it('should search treaty perils', async () => {
        mockService.getTreatyPerils.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyPerilCoverageApi());
        mockService.searchTreatyPerils.mockResolvedValue([{ id: '1' }] as any);

        const res = await result.current.searchTreatyPerils('query');
        expect(res).toEqual([{ id: '1' }]);
    });
});
