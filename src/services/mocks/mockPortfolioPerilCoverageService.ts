// mockPortfolioPerilCoverageService.ts
import { mockPortfolioPerils, type PortfolioPeril } from '../mockData/portfolioPerilCoverageMockData';

const MOCK_DELAY = 500;

export const mockPortfolioPerilCoverageService = {
  getPortfolioPerils: async (): Promise<PortfolioPeril[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPortfolioPerils);
      }, MOCK_DELAY);
    });
  },

  updatePortfolioPeril: async (
    id: string,
    updates: Partial<PortfolioPeril>
  ): Promise<PortfolioPeril | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockPortfolioPerils.find((item) => item.id === id);
        if (item) {
          Object.assign(item, updates);
          resolve(item);
        } else {
          resolve(undefined);
        }
      }, MOCK_DELAY);
    });
  },

  searchPortfolioPerils: async (query: string): Promise<PortfolioPeril[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockPortfolioPerils.filter(
          (item) =>
            item.database.toLowerCase().includes(query.toLowerCase()) ||
            item.portfolio.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, MOCK_DELAY);
    });
  },

  bulkUpdatePerilCoverage: async (
    updates: Array<{ id: string; updates: Partial<PortfolioPeril> }>
  ): Promise<PortfolioPeril[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        updates.forEach(({ id, updates: itemUpdates }) => {
          const item = mockPortfolioPerils.find((item) => item.id === id);
          if (item) {
            Object.assign(item, itemUpdates);
          }
        });
        resolve(mockPortfolioPerils);
      }, MOCK_DELAY);
    });
  },
};