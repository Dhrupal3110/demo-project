// ============= api/services/demandSurgeService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockDemandSurgeService } from './mocks/mockDemandSurgeService';
import type { DemandSurgeItem } from './mockData/demandSurgeMockData';

import { mockStepperService } from './mocks/mockSidebarStepperService';

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

    saveStepData: async (data: Record<string, unknown>): Promise<any> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.saveStepData(4, data);
        }
        const response = await apiClient.post('/demand-surge/step/save', data);
        return response;
    },

    validateStep: async (data: Record<string, unknown>): Promise<{ valid: boolean; errors: Record<string, string> }> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.validateStep(4, data);
        }
        const response = await apiClient.post<{ valid: boolean; errors: Record<string, string> }>('/demand-surge/step/validate', data);
        return response;
    },
};
