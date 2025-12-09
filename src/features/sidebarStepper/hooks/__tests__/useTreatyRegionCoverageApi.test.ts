import { renderHook, waitFor, act } from '@testing-library/react';
import { useTreatyRegionCoverageApi } from '../useTreatyRegionCoverageApi';
import { treatyRegionCoverageService } from '@/services/treatyRegionCoverageService';

jest.mock('@/services/treatyRegionCoverageService');
const mockService = treatyRegionCoverageService as jest.Mocked<typeof treatyRegionCoverageService>;

describe('useTreatyRegionCoverageApi Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        mockService.getTreatiesByPeril.mockResolvedValueOnce([]).mockResolvedValueOnce([]); // EQ/FF, IF
        mockService.getRegionsByPeril.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
        mockService.getSelectedRegions.mockResolvedValue([]);

        const { result } = renderHook(() => useTreatyRegionCoverageApi());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.treatiesEQFF).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
        mockService.getTreatiesByPeril.mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => useTreatyRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to fetch treaty region coverage data');
    });

    it('should add selected region', async () => {
        mockService.getTreatiesByPeril.mockResolvedValue([]);
        mockService.getRegionsByPeril.mockResolvedValue([]);
        mockService.getSelectedRegions.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const region = { id: '1' };
        mockService.addSelectedRegion.mockResolvedValue(region as any);

        await act(async () => {
            const res = await result.current.addSelectedRegion(region as any);
            expect(res).toEqual(region);
        });
    });

    it('should handle add region error', async () => {
        mockService.getTreatiesByPeril.mockResolvedValue([]);
        mockService.getRegionsByPeril.mockResolvedValue([]);
        mockService.getSelectedRegions.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.addSelectedRegion.mockRejectedValue(new Error('Fail'));

        await act(async () => {
            const res = await result.current.addSelectedRegion({} as any);
            expect(res).toBeNull();
        });
        expect(result.current.error).toBe('Failed to add selected region');
    });

    it('should remove selected region', async () => {
        mockService.getTreatiesByPeril.mockResolvedValue([]);
        mockService.getRegionsByPeril.mockResolvedValue([]);
        mockService.getSelectedRegions.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.removeSelectedRegion.mockResolvedValue(true);

        const res = await result.current.removeSelectedRegion('1');
        expect(res).toBe(true);
    });

    it('should search treaties', async () => {
        mockService.getTreatiesByPeril.mockResolvedValue([]);
        mockService.getRegionsByPeril.mockResolvedValue([]);
        mockService.getSelectedRegions.mockResolvedValue([]);
        const { result } = renderHook(() => useTreatyRegionCoverageApi());

        mockService.searchTreaties.mockResolvedValue([{ id: '1' }] as any);

        const res = await result.current.searchTreaties('q', 'EQ/FF');
        expect(res).toEqual([{ id: '1' }]);
    });
});
