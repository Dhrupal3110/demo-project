// mockPortfolioRegionCoverageService.ts
import {
  mockPortfoliosEQFF,
  mockPortfoliosIF,
  mockRegionsEQFF,
  mockRegionsIF,
  mockSelectedCoverage,
  type PortfolioItem,
  type Region,
  type SelectedCoverage,
} from '../mockData/portfolioRegionCoverageMockData';

const MOCK_DELAY = 500;

export interface PortfolioRegionCoverageData {
  portfoliosEQFF: PortfolioItem[];
  portfoliosIF: PortfolioItem[];
  regionsEQFF: Region[];
  regionsIF: Region[];
  selectedCoverage: SelectedCoverage[];
}

export const mockPortfolioRegionCoverageService = {
  getData: async (): Promise<PortfolioRegionCoverageData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          portfoliosEQFF: mockPortfoliosEQFF,
          portfoliosIF: mockPortfoliosIF,
          regionsEQFF: mockRegionsEQFF,
          regionsIF: mockRegionsIF,
          selectedCoverage: mockSelectedCoverage,
        });
      }, MOCK_DELAY);
    });
  },

  updatePortfolios: async (
    peril: 'EQ/FF' | 'IF',
    portfolios: PortfolioItem[]
  ): Promise<PortfolioItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (peril === 'EQ/FF') {
          mockPortfoliosEQFF.length = 0;
          mockPortfoliosEQFF.push(...portfolios);
        } else {
          mockPortfoliosIF.length = 0;
          mockPortfoliosIF.push(...portfolios);
        }
        resolve(portfolios);
      }, MOCK_DELAY);
    });
  },

  updateRegions: async (
    peril: 'EQ/FF' | 'IF',
    regions: Region[]
  ): Promise<Region[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (peril === 'EQ/FF') {
          mockRegionsEQFF.length = 0;
          mockRegionsEQFF.push(...regions);
        } else {
          mockRegionsIF.length = 0;
          mockRegionsIF.push(...regions);
        }
        resolve(regions);
      }, MOCK_DELAY);
    });
  },

  addSelectedCoverage: async (
    coverage: SelectedCoverage[]
  ): Promise<SelectedCoverage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockSelectedCoverage.push(...coverage);
        resolve(mockSelectedCoverage);
      }, MOCK_DELAY);
    });
  },

  removeSelectedCoverage: async (id: string): Promise<SelectedCoverage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSelectedCoverage.findIndex((item) => item.id === id);
        if (index !== -1) {
          mockSelectedCoverage.splice(index, 1);
        }
        resolve(mockSelectedCoverage);
      }, MOCK_DELAY);
    });
  },

  searchPortfolios: async (
    peril: 'EQ/FF' | 'IF',
    query: string
  ): Promise<PortfolioItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const portfolios = peril === 'EQ/FF' ? mockPortfoliosEQFF : mockPortfoliosIF;
        const filtered = portfolios.filter(
          (item) =>
            item.database.toLowerCase().includes(query.toLowerCase()) ||
            item.portfolio.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, MOCK_DELAY);
    });
  },
};