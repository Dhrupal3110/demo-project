// mockPortfolioService.ts
import { mockDatabases, type Database } from '../mockData/portfolioMockData';

const MOCK_DELAY = 500;

export const mockPortfolioService = {
  getDatabases: async (): Promise<Database[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDatabases);
      }, MOCK_DELAY);
    });
  },

  getDatabaseById: async (id: string): Promise<Database | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const database = mockDatabases.find((db) => db.id === id);
        resolve(database);
      }, MOCK_DELAY);
    });
  },

  searchPortfolios: async (query: string): Promise<Database[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockDatabases.map((db) => ({
          ...db,
          portfolios: db.portfolios.filter((p) =>
            p.portfolioName.toLowerCase().includes(query.toLowerCase())
          ),
        }));
        resolve(filtered);
      }, MOCK_DELAY);
    });
  },
};