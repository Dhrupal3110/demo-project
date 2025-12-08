// ============= api/services/portfolioRegionCoverageService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockPortfolioRegionCoverageService } from './mocks/mockPortfolioRegionCoverageService';
import type { PortfolioItem, Region, SelectedCoverage } from './mockData/portfolioRegionCoverageMockData';

import type { PortfolioRegionCoverageData } from './mocks/mockPortfolioRegionCoverageService';
export type { PortfolioRegionCoverageData } from './mocks/mockPortfolioRegionCoverageService';

import { mockStepperService } from './mocks/mockSidebarStepperService';

export const portfolioRegionCoverageService = {
    getData: async (): Promise<PortfolioRegionCoverageData> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioRegionCoverageService.getData();
        }
        const response = await apiClient.get<{ data: PortfolioRegionCoverageData }>('/portfolio-region-coverage');
        return response.data;
    },

    updatePortfolios: async (
        peril: 'EQ/FF' | 'IF',
        portfolios: PortfolioItem[]
    ): Promise<PortfolioItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioRegionCoverageService.updatePortfolios(peril, portfolios);
        }
        const response = await apiClient.put<{ data: PortfolioItem[] }>('/portfolio-region-coverage/portfolios', { peril, portfolios });
        return response.data;
    },

    updateRegions: async (
        peril: 'EQ/FF' | 'IF',
        regions: Region[]
    ): Promise<Region[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioRegionCoverageService.updateRegions(peril, regions);
        }
        const response = await apiClient.put<{ data: Region[] }>('/portfolio-region-coverage/regions', { peril, regions });
        return response.data;
    },

    addSelectedCoverage: async (
        coverage: SelectedCoverage[]
    ): Promise<SelectedCoverage[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioRegionCoverageService.addSelectedCoverage(coverage);
        }
        const response = await apiClient.post<{ data: SelectedCoverage[] }>('/portfolio-region-coverage/selected', { coverage });
        return response.data;
    },

    removeSelectedCoverage: async (id: string): Promise<SelectedCoverage[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioRegionCoverageService.removeSelectedCoverage(id);
        }
        const response = await apiClient.delete<{ data: SelectedCoverage[] }>(`/portfolio-region-coverage/selected/${id}`);
        return response.data;
    },

    searchPortfolios: async (
        peril: 'EQ/FF' | 'IF',
        query: string
    ): Promise<PortfolioItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockPortfolioRegionCoverageService.searchPortfolios(peril, query);
        }
        const response = await apiClient.get<{ data: PortfolioItem[] }>('/portfolio-region-coverage/search', {
            params: { peril, q: query }
        });
        return response.data;
    },

    saveStepData: async (data: Record<string, unknown>): Promise<any> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.saveStepData(6, data);
        }
        const response = await apiClient.post('/portfolio-region-coverage/step/save', data);
        return response;
    },

    validateStep: async (data: Record<string, unknown>): Promise<{ valid: boolean; errors: Record<string, string> }> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.validateStep(6, data);
        }
        const response = await apiClient.post<{ valid: boolean; errors: Record<string, string> }>('/portfolio-region-coverage/step/validate', data);
        return response;
    },
};
