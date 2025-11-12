// mockTreatyPerilCoverageService.ts
import { mockTreatyPerils, type TreatyPeril } from '../mockData/treatyPerilCoverageMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTreatyPerilCoverageService = {
  getTreatyPerils: async (): Promise<TreatyPeril[]> => {
    await delay(500);
    return mockTreatyPerils;
  },

  updateTreatyPeril: async (id: string, data: Partial<TreatyPeril>): Promise<TreatyPeril> => {
    await delay(300);
    const treaty = mockTreatyPerils.find(t => t.id === id);
    if (!treaty) {
      throw new Error('Treaty not found');
    }
    return { ...treaty, ...data };
  },

  searchTreatyPerils: async (query: string): Promise<TreatyPeril[]> => {
    await delay(300);
    return mockTreatyPerils.filter(
      item =>
        item.database.toLowerCase().includes(query.toLowerCase()) ||
        item.treaty.toLowerCase().includes(query.toLowerCase())
    );
  },
};