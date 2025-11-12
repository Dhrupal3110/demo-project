// useDemandSurgeApi.ts
import { useState, useEffect } from 'react';

import type { DemandSurgeItem } from '@/services/mockData/demandSurgeMockData';
import { mockDemandSurgeService } from '@/services/mocks/mockDemandSurgeService';


export const useDemandSurgeApi = () => {
  const [items, setItems] = useState<DemandSurgeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDemandSurgeItems();
  }, []);

  const fetchDemandSurgeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockDemandSurgeService.getDemandSurgeItems();
      setItems(data);
    } catch {
      setError('Failed to fetch demand surge items');
    } finally {
      setLoading(false);
    }
  };

  const updateDemandSurgeItem = async (
    id: string,
    updates: Partial<DemandSurgeItem>
  ): Promise<DemandSurgeItem | undefined> => {
    try {
      const updated = await mockDemandSurgeService.updateDemandSurgeItem(id, updates);
      if (updated) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
      }
      return updated;
    } catch {
      setError('Failed to update demand surge item');
      return undefined;
    }
  };

  const searchDemandSurgeItems = async (
    databaseQuery: string,
    portfolioQuery: string
  ): Promise<DemandSurgeItem[]> => {
    try {
      return await mockDemandSurgeService.searchDemandSurgeItems(
        databaseQuery,
        portfolioQuery
      );
    } catch {
      setError('Failed to search demand surge items');
      return [];
    }
  };

  return {
    items,
    loading,
    error,
    fetchDemandSurgeItems,
    updateDemandSurgeItem,
    searchDemandSurgeItems,
  };
};