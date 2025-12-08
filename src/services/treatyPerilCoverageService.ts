// ============= api/services/treatyPerilCoverageService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockTreatyPerilCoverageService } from './mocks/mockTreatyPerilCoverageService';
import type { TreatyPeril } from './mockData/treatyPerilCoverageMockData';

import { mockStepperService } from './mocks/mockSidebarStepperService';

export const treatyPerilCoverageService = {
    getTreatyPerils: async (): Promise<TreatyPeril[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyPerilCoverageService.getTreatyPerils();
        }
        const response = await apiClient.get<{ data: TreatyPeril[] }>('/treaty-peril-coverage');
        return response.data;
    },

    updateTreatyPeril: async (id: string, data: Partial<TreatyPeril>): Promise<TreatyPeril> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyPerilCoverageService.updateTreatyPeril(id, data);
        }
        const response = await apiClient.patch<{ data: TreatyPeril }>(`/treaty-peril-coverage/${id}`, data);
        return response.data;
    },

    searchTreatyPerils: async (query: string): Promise<TreatyPeril[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyPerilCoverageService.searchTreatyPerils(query);
        }
        const response = await apiClient.get<{ data: TreatyPeril[] }>('/treaty-peril-coverage/search', {
            params: { q: query }
        });
        return response.data;
    },

    saveStepData: async (data: Record<string, unknown>): Promise<any> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.saveStepData(8, data);
        }
        const response = await apiClient.post('/treaty-peril-coverage/step/save', data);
        return response;
    },

    validateStep: async (data: Record<string, unknown>): Promise<{ valid: boolean; errors: Record<string, string> }> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.validateStep(8, data);
        }
        const response = await apiClient.post<{ valid: boolean; errors: Record<string, string> }>('/treaty-peril-coverage/step/validate', data);
        return response;
    },
};
