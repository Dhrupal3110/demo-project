// ============= api/services/portfolioService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockPortfolioService } from './mocks/mockPortfolioService';
import type { Database } from './mockData/portfolioMockData';

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
};
