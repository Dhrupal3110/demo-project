// ============= api/services/portfolioService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockPortfolioService } from './mocks/mockPortfolioService';
import type { Database } from './mockData/portfolioMockData';

import { mockStepperService } from './mocks/mockSidebarStepperService';

export const portfolioService = {
    getDatabases: async (): Promise<Database[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioService.getDatabases();
        }
        const response = await apiClient.get<{ data: Database[] }>('/portfolios/databases');
        return response.data;
    },

    getDatabaseById: async (id: string): Promise<Database | undefined> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioService.getDatabaseById(id);
        }
        const response = await apiClient.get<{ data: Database }>(`/portfolios/databases/${id}`);
        return response.data;
    },

    searchPortfolios: async (query: string): Promise<Database[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioService.searchPortfolios(query);
        }
        const response = await apiClient.get<{ data: Database[] }>('/portfolios/search', {
            params: { q: query }
        });
        return response.data;
    },

    saveStepData: async (data: Record<string, unknown>): Promise<any> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.saveStepData(3, data);
        }
        const response = await apiClient.post('/portfolios/step/save', data);
        return response;
    },

    validateStep: async (data: Record<string, unknown>): Promise<{ valid: boolean; errors: Record<string, string> }> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.validateStep(3, data);
        }
        const response = await apiClient.post<{ valid: boolean; errors: Record<string, string> }>('/portfolios/step/validate', data);
        return response;
    },
};
