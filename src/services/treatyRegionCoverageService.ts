// ============= api/services/treatyRegionCoverageService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockTreatyRegionCoverageService } from './mocks/mockTreatyRegionCoverageService';
import type { TreatyItem, Region, SelectedRegion } from './mockData/treatyRegionCoverageMockData';

export const treatyRegionCoverageService = {
    getTreatiesByPeril: async (peril: 'EQ/FF' | 'IF'): Promise<TreatyItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyRegionCoverageService.getTreatiesByPeril(peril);
        }
        const response = await apiClient.get<{ data: TreatyItem[] }>('/treaty-region-coverage/treaties', {
            params: { peril }
        });
        return response.data;
    },

    getRegionsByPeril: async (peril: 'EQ/FF' | 'IF'): Promise<Region[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyRegionCoverageService.getRegionsByPeril(peril);
        }
        const response = await apiClient.get<{ data: Region[] }>('/treaty-region-coverage/regions', {
            params: { peril }
        });
        return response.data;
    },

    getSelectedRegions: async (): Promise<SelectedRegion[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyRegionCoverageService.getSelectedRegions();
        }
        const response = await apiClient.get<{ data: SelectedRegion[] }>('/treaty-region-coverage/selected');
        return response.data;
    },

    addSelectedRegion: async (region: SelectedRegion): Promise<SelectedRegion> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyRegionCoverageService.addSelectedRegion(region);
        }
        const response = await apiClient.post<{ data: SelectedRegion }>('/treaty-region-coverage/selected', region);
        return response.data;
    },

    removeSelectedRegion: async (id: string): Promise<boolean> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyRegionCoverageService.removeSelectedRegion(id);
        }
        await apiClient.delete(`/treaty-region-coverage/selected/${id}`);
        return true;
    },

    searchTreaties: async (query: string, peril: 'EQ/FF' | 'IF'): Promise<TreatyItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockTreatyRegionCoverageService.searchTreaties(query, peril);
        }
        const response = await apiClient.get<{ data: TreatyItem[] }>('/treaty-region-coverage/search', {
            params: { q: query, peril }
        });
        return response.data;
    },
};
