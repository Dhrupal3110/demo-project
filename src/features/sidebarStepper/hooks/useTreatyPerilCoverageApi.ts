// useTreatyPerilCoverageApi.ts
import { useState, useEffect } from 'react';

import type { TreatyPeril } from '@/services/mockData/treatyPerilCoverageMockData';
import { mockTreatyPerilCoverageService } from '@/services/mocks/mockTreatyPerilCoverageService';

export const useTreatyPerilCoverageApi = () => {
  const [treatyPerils, setTreatyPerils] = useState<TreatyPeril[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatyPerils = async () => {
      try {
        setLoading(true);
        const data = await mockTreatyPerilCoverageService.getTreatyPerils();
        setTreatyPerils(data);
      } catch {
        setError('Failed to fetch treaty perils');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatyPerils();
  }, []);

  const updateTreatyPeril = async (id: string, data: Partial<TreatyPeril>): Promise<TreatyPeril | null> => {
    try {
      return await mockTreatyPerilCoverageService.updateTreatyPeril(id, data);
    } catch {
      setError('Failed to update treaty peril');
      return null;
    }
  };

  const searchTreatyPerils = async (query: string): Promise<TreatyPeril[]> => {
    try {
      return await mockTreatyPerilCoverageService.searchTreatyPerils(query);
    } catch {
      setError('Failed to search treaty perils');
      return [];
    }
  };

  return {
    treatyPerils,
    loading,
    error,
    updateTreatyPeril,
    searchTreatyPerils,
  };
};