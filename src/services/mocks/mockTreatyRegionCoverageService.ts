// mockTreatyRegionCoverageService.ts
import {
  mockTreatiesEQFF,
  mockTreatiesIF,
  mockRegionsEQFF,
  mockRegionsIF,
  mockSelectedRegions,
  type TreatyItem,
  type Region,
  type SelectedRegion,
} from '../mockData/treatyRegionCoverageMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTreatyRegionCoverageService = {
  getTreatiesByPeril: async (peril: 'EQ/FF' | 'IF'): Promise<TreatyItem[]> => {
    await delay(500);
    return peril === 'EQ/FF' ? mockTreatiesEQFF : mockTreatiesIF;
  },

  getRegionsByPeril: async (peril: 'EQ/FF' | 'IF'): Promise<Region[]> => {
    await delay(500);
    return peril === 'EQ/FF' ? mockRegionsEQFF : mockRegionsIF;
  },

  getSelectedRegions: async (): Promise<SelectedRegion[]> => {
    await delay(500);
    return mockSelectedRegions;
  },

  addSelectedRegion: async (region: SelectedRegion): Promise<SelectedRegion> => {
    await delay(300);
    return region;
  },

  removeSelectedRegion: async (id: string): Promise<boolean> => {
    console.log('id: ', id);
    await delay(300);
    return true;
  },

  searchTreaties: async (query: string, peril: 'EQ/FF' | 'IF'): Promise<TreatyItem[]> => {
    await delay(300);
    const treaties = peril === 'EQ/FF' ? mockTreatiesEQFF : mockTreatiesIF;
    return treaties.filter(
      item =>
        item.database.toLowerCase().includes(query.toLowerCase()) ||
        item.treaty.toLowerCase().includes(query.toLowerCase())
    );
  },
};