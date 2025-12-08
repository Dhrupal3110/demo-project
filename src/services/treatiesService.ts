// ============= api/services/treatiesService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockTreatiesService } from './mocks/mockTreatiesService';
import type { Database, Treaty } from './mockData/treatiesMockData';

import { mockStepperService } from './mocks/mockSidebarStepperService';

export const treatiesService = {
    getDatabases: async (): Promise<Database[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatiesService.getDatabases();
        }
        const response = await apiClient.get<{ data: Database[] }>('/treaties/databases');
        return response.data;
    },

    getTreatiesByDatabase: async (databaseId: string): Promise<Treaty[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatiesService.getTreatiesByDatabase(databaseId);
        }
        const response = await apiClient.get<{ data: Treaty[] }>(`/treaties/databases/${databaseId}/treaties`);
        return response.data;
    },

    searchTreaties: async (query: string): Promise<Treaty[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatiesService.searchTreaties(query);
        }
        const response = await apiClient.get<{ data: Treaty[] }>('/treaties/search', {
            params: { q: query }
        });
        return response.data;
    },

    saveStepData: async (data: Record<string, unknown>): Promise<any> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.saveStepData(7, data);
        }
        const response = await apiClient.post('/treaties/step/save', data);
        return response;
    },

    validateStep: async (data: Record<string, unknown>): Promise<{ valid: boolean; errors: Record<string, string> }> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.validateStep(7, data);
        }
        const response = await apiClient.post<{ valid: boolean; errors: Record<string, string> }>('/treaties/step/validate', data);
        return response;
    },
};
