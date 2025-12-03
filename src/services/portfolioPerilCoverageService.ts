// ============= api/services/portfolioPerilCoverageService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockPortfolioPerilCoverageService } from './mocks/mockPortfolioPerilCoverageService';
import type { PortfolioPeril } from './mockData/portfolioPerilCoverageMockData';

export const portfolioPerilCoverageService = {
    getPortfolioPerils: async (): Promise<PortfolioPeril[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioPerilCoverageService.getPortfolioPerils();
        }
        const response = await apiClient.get<{ data: PortfolioPeril[] }>('/portfolio-peril-coverage');
        return response.data;
    },

    updatePortfolioPeril: async (
        id: string,
        updates: Partial<PortfolioPeril>
    ): Promise<PortfolioPeril | undefined> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioPerilCoverageService.updatePortfolioPeril(id, updates);
        }
        const response = await apiClient.patch<{ data: PortfolioPeril }>(`/portfolio-peril-coverage/${id}`, updates);
        return response.data;
    },

    searchPortfolioPerils: async (query: string): Promise<PortfolioPeril[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioPerilCoverageService.searchPortfolioPerils(query);
        }
        const response = await apiClient.get<{ data: PortfolioPeril[] }>('/portfolio-peril-coverage/search', {
            params: { q: query }
        });
        return response.data;
    },

    bulkUpdatePerilCoverage: async (
        updates: Array<{ id: string; updates: Partial<PortfolioPeril> }>
    ): Promise<PortfolioPeril[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioPerilCoverageService.bulkUpdatePerilCoverage(updates);
        }
        const response = await apiClient.post<{ data: PortfolioPeril[] }>('/portfolio-peril-coverage/bulk-update', { updates });
        return response.data;
    },
};
