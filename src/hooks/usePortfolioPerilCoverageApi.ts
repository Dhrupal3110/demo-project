// usePortfolioPerilCoverageApi.ts
import { useState, useEffect } from 'react';
import { mockPortfolioPerilCoverageService } from '../api/mocks/mockPortfolioPerilCoverageService';
import type { PortfolioPeril } from '../api/mockData/portfolioPerilCoverageMockData';


export const usePortfolioPerilCoverageApi = () => {
  const [items, setItems] = useState<PortfolioPeril[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioPerils();
  }, []);

  const fetchPortfolioPerils = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockPortfolioPerilCoverageService.getPortfolioPerils();
      setItems(data);
    } catch (err) {
      setError('Failed to fetch portfolio perils');
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioPeril = async (
    id: string,
    updates: Partial<PortfolioPeril>
  ): Promise<PortfolioPeril | undefined> => {
    try {
      const updated = await mockPortfolioPerilCoverageService.updatePortfolioPeril(
        id,
        updates
      );
      if (updated) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
      }
      return updated;
    } catch (err) {
      setError('Failed to update portfolio peril');
      return undefined;
    }
  };

  const searchPortfolioPerils = async (query: string): Promise<PortfolioPeril[]> => {
    try {
      return await mockPortfolioPerilCoverageService.searchPortfolioPerils(query);
    } catch (err) {
      setError('Failed to search portfolio perils');
      return [];
    }
  };

  const bulkUpdatePerilCoverage = async (
    updates: Array<{ id: string; updates: Partial<PortfolioPeril> }>
  ): Promise<PortfolioPeril[]> => {
    try {
      const updated = await mockPortfolioPerilCoverageService.bulkUpdatePerilCoverage(
        updates
      );
      setItems(updated);
      return updated;
    } catch (err) {
      setError('Failed to bulk update peril coverage');
      return [];
    }
  };

  return {
    items,
    loading,
    error,
    fetchPortfolioPerils,
    updatePortfolioPeril,
    searchPortfolioPerils,
    bulkUpdatePerilCoverage,
  };
};