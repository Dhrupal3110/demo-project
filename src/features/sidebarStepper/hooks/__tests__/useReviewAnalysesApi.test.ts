import { renderHook, waitFor, act } from '@testing-library/react';
import { useReviewAnalysesApi } from '../useReviewAnalysesApi';
import { reviewAnalysesService } from '@/services/reviewAnalysesService';

jest.mock('@/services/reviewAnalysesService');
const mockService = reviewAnalysesService as jest.Mocked<typeof reviewAnalysesService>;

describe('useReviewAnalysesApi Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        const mockData = { analyses: [], context: '', currencyOptions: [], priorityOptions: [], contextOptions: [] };
        mockService.fetchReviewAnalysesData.mockResolvedValue(mockData as any);

        const { result } = renderHook(() => useReviewAnalysesApi());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.reviewData).toEqual(mockData);
    });

    it('should handle fetch error', async () => {
        mockService.fetchReviewAnalysesData.mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => useReviewAnalysesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to load review analyses data');
    });

    it('should update analysis currency', async () => {
        const mockData = { analyses: [{ id: '1', currency: 'USD' }], context: '' };
        mockService.fetchReviewAnalysesData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => useReviewAnalysesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updatedConfig = { id: '1', currency: 'EUR' };
        mockService.updateAnalysis.mockResolvedValue(updatedConfig as any);

        await act(async () => {
            await result.current.updateAnalysisCurrency('1', 'EUR');
        });

        expect(mockService.updateAnalysis).toHaveBeenCalledWith('1', { currency: 'EUR' });
        expect(result.current.reviewData?.analyses[0].currency).toBe('EUR');
    });

    it('should update analysis priority', async () => {
        const mockData = { analyses: [{ id: '1', priority: 'Low' }] };
        mockService.fetchReviewAnalysesData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => useReviewAnalysesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updatedConfig = { id: '1', priority: 'High' };
        mockService.updateAnalysis.mockResolvedValue(updatedConfig as any);

        await act(async () => {
            await result.current.updateAnalysisPriority('1', 'High');
        });

        expect(mockService.updateAnalysis).toHaveBeenCalledWith('1', { priority: 'High' });
        expect(result.current.reviewData?.analyses[0].priority).toBe('High');
    });

    it('should update context', async () => {
        const mockData = { context: 'Old' };
        mockService.fetchReviewAnalysesData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => useReviewAnalysesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockService.updateContext.mockResolvedValue('New');

        await act(async () => {
            await result.current.updateContext('New');
        });

        expect(mockService.updateContext).toHaveBeenCalledWith('New');
        expect(result.current.reviewData?.context).toBe('New');
    });

    it('should toggle expanded', async () => {
        const mockData = { analyses: [{ id: '1', expanded: false }] };
        mockService.fetchReviewAnalysesData.mockResolvedValue(mockData as any);
        const { result } = renderHook(() => useReviewAnalysesApi());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updated = { id: '1', expanded: true };
        mockService.toggleExpanded.mockResolvedValue(updated as any);

        await act(async () => {
            await result.current.toggleExpanded('1');
        });

        expect(result.current.reviewData?.analyses[0].expanded).toBe(true);
    });
});
