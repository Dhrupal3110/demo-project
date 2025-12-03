// ============= api/services/treatiesService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockTreatiesService } from './mocks/mockTreatiesService';
import type { Database, Treaty } from './mockData/treatiesMockData';

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
};
