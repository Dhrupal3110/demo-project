// mockTreatiesService.ts
import { mockDatabases, type Database, type Treaty } from '../mockData/treatiesMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTreatiesService = {
  getDatabases: async (): Promise<Database[]> => {
    await delay(500);
    return mockDatabases;
  },

  getTreatiesByDatabase: async (databaseId: string): Promise<Treaty[]> => {
    await delay(300);
    const database = mockDatabases.find(db => db.id === databaseId);
    return database?.treaties || [];
  },

  searchTreaties: async (query: string): Promise<Treaty[]> => {
    await delay(300);
    const allTreaties = mockDatabases.flatMap(db => db.treaties);
    return allTreaties.filter(treaty =>
      treaty.name.toLowerCase().includes(query.toLowerCase())
    );
  },
};