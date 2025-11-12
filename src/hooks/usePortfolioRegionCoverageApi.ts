// usePortfolioRegionCoverageApi.ts
import { useState, useEffect } from 'react';
import { mockPortfolioRegionCoverageService, type PortfolioRegionCoverageData } from '../api/services/mockPortfolioRegionCoverageService';
import type { PortfolioItem, Region, SelectedCoverage } from '../api/mockData/portfolioRegionCoverageMockData';


export const usePortfolioRegionCoverageApi = () => {
  const [data, setData] = useState<PortfolioRegionCoverageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await mockPortfolioRegionCoverageService.getData();
      setData(result);
    } catch {
      setError('Failed to fetch portfolio region coverage data');
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolios = async (
    peril: 'EQ/FF' | 'IF',
    portfolios: PortfolioItem[]
  ): Promise<PortfolioItem[]> => {
    try {
      const updated = await mockPortfolioRegionCoverageService.updatePortfolios(
        peril,
        portfolios
      );
      if (data) {
        const key = peril === 'EQ/FF' ? 'portfoliosEQFF' : 'portfoliosIF';
        setData({ ...data, [key]: updated });
      }
      return updated;
    } catch {
      setError('Failed to update portfolios');
      return [];
    }
  };

  const updateRegions = async (
    peril: 'EQ/FF' | 'IF',
    regions: Region[]
  ): Promise<Region[]> => {
    try {
      const updated = await mockPortfolioRegionCoverageService.updateRegions(
        peril,
        regions
      );
      if (data) {
        const key = peril === 'EQ/FF' ? 'regionsEQFF' : 'regionsIF';
        setData({ ...data, [key]: updated });
      }
      return updated;
    } catch {
      setError('Failed to update regions');
      return [];
    }
  };

  const addSelectedCoverage = async (
    coverage: SelectedCoverage[]
  ): Promise<SelectedCoverage[]> => {
    try {
      const updated = await mockPortfolioRegionCoverageService.addSelectedCoverage(
        coverage
      );
      if (data) {
        setData({ ...data, selectedCoverage: updated });
      }
      return updated;
    } catch {
      setError('Failed to add selected coverage');
      return [];
    }
  };

  const removeSelectedCoverage = async (id: string): Promise<SelectedCoverage[]> => {
    try {
      const updated = await mockPortfolioRegionCoverageService.removeSelectedCoverage(
        id
      );
      if (data) {
        setData({ ...data, selectedCoverage: updated });
      }
      return updated;
    } catch {
      setError('Failed to remove selected coverage');
      return [];
    }
  };

  const searchPortfolios = async (
    peril: 'EQ/FF' | 'IF',
    query: string
  ): Promise<PortfolioItem[]> => {
    try {
      return await mockPortfolioRegionCoverageService.searchPortfolios(peril, query);
    } catch {
      setError('Failed to search portfolios');
      return [];
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
    updatePortfolios,
    updateRegions,
    addSelectedCoverage,
    removeSelectedCoverage,
    searchPortfolios,
  };
};