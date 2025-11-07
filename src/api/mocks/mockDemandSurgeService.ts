// mockDemandSurgeService.ts
import { mockDemandSurgeItems, type DemandSurgeItem } from './demandSurgeMockData';

const MOCK_DELAY = 500;

export const mockDemandSurgeService = {
  getDemandSurgeItems: async (): Promise<DemandSurgeItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDemandSurgeItems);
      }, MOCK_DELAY);
    });
  },

  updateDemandSurgeItem: async (
    id: string,
    updates: Partial<DemandSurgeItem>
  ): Promise<DemandSurgeItem | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockDemandSurgeItems.find((item) => item.id === id);
        if (item) {
          Object.assign(item, updates);
          resolve(item);
        } else {
          resolve(undefined);
        }
      }, MOCK_DELAY);
    });
  },

  searchDemandSurgeItems: async (
    databaseQuery: string,
    portfolioQuery: string
  ): Promise<DemandSurgeItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockDemandSurgeItems.filter(
          (item) =>
            item.databaseName.toLowerCase().includes(databaseQuery.toLowerCase()) &&
            item.portfolioName.toLowerCase().includes(portfolioQuery.toLowerCase())
        );
        resolve(filtered);
      }, MOCK_DELAY);
    });
  },
};