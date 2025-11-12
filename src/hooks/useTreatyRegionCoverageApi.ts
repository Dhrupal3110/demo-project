// useTreatyRegionCoverageApi.ts
import { useState, useEffect } from 'react';
import { mockTreatyRegionCoverageService } from '../api/mocks/mockTreatyRegionCoverageService';
import type { TreatyItem, Region, SelectedRegion } from '../api/mockData/treatyRegionCoverageMockData';

export const useTreatyRegionCoverageApi = () => {
  const [treatiesEQFF, setTreatiesEQFF] = useState<TreatyItem[]>([]);
  const [treatiesIF, setTreatiesIF] = useState<TreatyItem[]>([]);
  const [regionsEQFF, setRegionsEQFF] = useState<Region[]>([]);
  const [regionsIF, setRegionsIF] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<SelectedRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eqffTreaties, ifTreaties, eqffRegions, ifRegions, selected] = await Promise.all([
          mockTreatyRegionCoverageService.getTreatiesByPeril('EQ/FF'),
          mockTreatyRegionCoverageService.getTreatiesByPeril('IF'),
          mockTreatyRegionCoverageService.getRegionsByPeril('EQ/FF'),
          mockTreatyRegionCoverageService.getRegionsByPeril('IF'),
          mockTreatyRegionCoverageService.getSelectedRegions(),
        ]);
        setTreatiesEQFF(eqffTreaties);
        setTreatiesIF(ifTreaties);
        setRegionsEQFF(eqffRegions);
        setRegionsIF(ifRegions);
        setSelectedRegions(selected);
      } catch {
        setError('Failed to fetch treaty region coverage data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addSelectedRegion = async (region: SelectedRegion): Promise<SelectedRegion | null> => {
    try {
      return await mockTreatyRegionCoverageService.addSelectedRegion(region);
    } catch {
      setError('Failed to add selected region');
      return null;
    }
  };

  const removeSelectedRegion = async (id: string): Promise<boolean> => {
    try {
      return await mockTreatyRegionCoverageService.removeSelectedRegion(id);
    } catch {
      setError('Failed to remove selected region');
      return false;
    }
  };

  const searchTreaties = async (query: string, peril: 'EQ/FF' | 'IF'): Promise<TreatyItem[]> => {
    try {
      return await mockTreatyRegionCoverageService.searchTreaties(query, peril);
    } catch {
      setError('Failed to search treaties');
      return [];
    }
  };

  return {
    treatiesEQFF,
    treatiesIF,
    regionsEQFF,
    regionsIF,
    selectedRegions,
    loading,
    error,
    addSelectedRegion,
    removeSelectedRegion,
    searchTreaties,
  };
};