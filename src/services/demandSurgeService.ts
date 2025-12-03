// ============= api/services/demandSurgeService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockDemandSurgeService } from './mocks/mockDemandSurgeService';
import type { DemandSurgeItem } from './mockData/demandSurgeMockData';

export const demandSurgeService = {
    getDemandSurgeItems: async (): Promise<DemandSurgeItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockDemandSurgeService.getDemandSurgeItems();
        }
        const response = await apiClient.get<{ data: DemandSurgeItem[] }>('/demand-surge');
        return response.data;
    },

    updateDemandSurgeItem: async (
        id: string,
        updates: Partial<DemandSurgeItem>
    ): Promise<DemandSurgeItem | undefined> => {
        if (API_CONFIG.useDummyAPI) {
            return mockDemandSurgeService.updateDemandSurgeItem(id, updates);
        }
        const response = await apiClient.patch<{ data: DemandSurgeItem }>(`/demand-surge/${id}`, updates);
        return response.data;
    },

    searchDemandSurgeItems: async (
        databaseQuery: string,
        portfolioQuery: string
    ): Promise<DemandSurgeItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockDemandSurgeService.searchDemandSurgeItems(databaseQuery, portfolioQuery);
        }
        const response = await apiClient.get<{ data: DemandSurgeItem[] }>('/demand-surge/search', {
            params: { database: databaseQuery, portfolio: portfolioQuery }
        });
        return response.data;
    },
};
