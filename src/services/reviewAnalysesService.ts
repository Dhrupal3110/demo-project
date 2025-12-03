// ============= api/services/reviewAnalysesService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockReviewAnalysesService } from './mocks/mockReviewAnalysesService';
import type { ReviewAnalysesData, Analysis } from './mockData/reviewAnalysesMockData';

export const reviewAnalysesService = {
    fetchReviewAnalysesData: async (): Promise<ReviewAnalysesData> => {
        if (API_CONFIG.useDummyAPI) {
            return mockReviewAnalysesService.fetchReviewAnalysesData();
        }
        const response = await apiClient.get<{ data: ReviewAnalysesData }>('/review-analyses');
        return response.data;
    },

    updateAnalysis: async (id: string, updates: Partial<Analysis>): Promise<Analysis> => {
        if (API_CONFIG.useDummyAPI) {
            return mockReviewAnalysesService.updateAnalysis(id, updates);
        }
        const response = await apiClient.patch<{ data: Analysis }>(`/review-analyses/${id}`, updates);
        return response.data;
    },

    updateContext: async (context: string): Promise<string> => {
        if (API_CONFIG.useDummyAPI) {
            return mockReviewAnalysesService.updateContext(context);
        }
        const response = await apiClient.put<{ data: string }>('/review-analyses/context', { context });
        return response.data;
    },

    toggleExpanded: async (id: string): Promise<Analysis> => {
        if (API_CONFIG.useDummyAPI) {
            return mockReviewAnalysesService.toggleExpanded(id);
        }
        const response = await apiClient.post<{ data: Analysis }>(`/review-analyses/${id}/toggle-expanded`);
        return response.data;
    },
};
