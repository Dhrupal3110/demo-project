import { renderHook, waitFor, act } from '@testing-library/react';
import { usePortfolioRegionCoverageApi } from '../usePortfolioRegionCoverageApi';
import { portfolioRegionCoverageService } from '@/services/portfolioRegionCoverageService';

jest.mock('@/services/portfolioRegionCoverageService');
const mockService = portfolioRegionCoverageService as jest.Mocked<typeof portfolioRegionCoverageService>;

describe('usePortfolioRegionCoverageApi Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        const mockData = {
            portfoliosEQFF: [],
            portfoliosIF: [],
            regionsEQFF: [],
            regionsIF: [],
            selectedCoverage: []
        };
        mockService.getData.mockResolvedValue(mockData as any);

        const { result } = renderHook(() => usePortfolioRegionCoverageApi());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
        mockService.getData.mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to fetch portfolio region coverage data');
    });

    it('should update portfolios', async () => {
        const mockData = { portfoliosEQFF: [] };
        mockService.getData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updatedPorts = [{ id: '1' }];
        mockService.updatePortfolios.mockResolvedValue(updatedPorts as any);

        await act(async () => {
            const res = await result.current.updatePortfolios('EQ/FF', updatedPorts as any);
            expect(res).toEqual(updatedPorts);
        });

        expect(mockService.updatePortfolios).toHaveBeenCalledWith('EQ/FF', updatedPorts);
        expect(result.current.data?.portfoliosEQFF).toEqual(updatedPorts);
    });

    it('should handle update portfolios error', async () => {
        mockService.getData.mockResolvedValue({} as any);
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.updatePortfolios.mockRejectedValue(new Error('Fail'));

        await act(async () => {
            const res = await result.current.updatePortfolios('EQ/FF', []);
            expect(res).toEqual([]);
        });

        expect(result.current.error).toBe('Failed to update portfolios');
    });

    it('should update regions', async () => {
        const mockData = { regionsEQFF: [] };
        mockService.getData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updatedRegs = [{ id: '1' }];
        mockService.updateRegions.mockResolvedValue(updatedRegs as any);

        await act(async () => {
            await result.current.updateRegions('EQ/FF', updatedRegs as any);
        });

        expect(result.current.data?.regionsEQFF).toEqual(updatedRegs);
    });

    it('should add selected coverage', async () => {
        const mockData = { selectedCoverage: [] };
        mockService.getData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updated = [{ id: '1' }];
        mockService.addSelectedCoverage.mockResolvedValue(updated as any);

        await act(async () => {
            await result.current.addSelectedCoverage([] as any);
        });

        expect(result.current.data?.selectedCoverage).toEqual(updated);
    });

    it('should remove selected coverage', async () => {
        const mockData = { selectedCoverage: [{ id: '1' }] };
        mockService.getData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.removeSelectedCoverage.mockResolvedValue([]);

        await act(async () => {
            await result.current.removeSelectedCoverage('1');
        });

        expect(result.current.data?.selectedCoverage).toEqual([]);
    });

    it('should search portfolios', async () => {
        mockService.getData.mockResolvedValue({} as any);
        const { result } = renderHook(() => usePortfolioRegionCoverageApi());
        mockService.searchPortfolios.mockResolvedValue([{ id: '1' }] as any);

        const data = await result.current.searchPortfolios('EQ/FF', 'q');
        expect(data).toEqual([{ id: '1' }]);
    });
});
