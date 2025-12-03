// ============= api/services/linkPortfoliosTreatiesService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockLinkService } from './mocks/mockLinkPortfoliosTreatiesService';
import type { LinkData, LinkedItem } from './mockData/linkPortfoliosTreatiesMockData';

export const linkPortfoliosTreatiesService = {
    fetchLinkData: async (): Promise<LinkData> => {
        if (API_CONFIG.useDummyAPI) {
            return mockLinkService.fetchLinkData();
        }
        const response = await apiClient.get<{ data: LinkData }>('/link-portfolios-treaties');
        return response.data;
    },

    addLinkedItems: async (items: LinkedItem[]): Promise<LinkedItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockLinkService.addLinkedItems(items);
        }
        const response = await apiClient.post<{ data: LinkedItem[] }>('/link-portfolios-treaties/items', { items });
        return response.data;
    },

    removeLinkedItem: async (id: string): Promise<void> => {
        if (API_CONFIG.useDummyAPI) {
            return mockLinkService.removeLinkedItem(id);
        }
        await apiClient.delete(`/link-portfolios-treaties/items/${id}`);
    },

    updateLinkedItems: async (items: LinkedItem[]): Promise<LinkedItem[]> => {
        if (API_CONFIG.useDummyAPI) {
            return mockLinkService.updateLinkedItems(items);
        }
        const response = await apiClient.put<{ data: LinkedItem[] }>('/link-portfolios-treaties/items', { items });
        return response.data;
    },
};
