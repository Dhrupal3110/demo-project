// useTreatiesApi.ts
import { useState, useEffect } from 'react';

import type { Database } from '@/services/mockData/databaseMockData';
import { mockTreatiesService } from '@/services/mocks/mockTreatiesService';
import type { Treaty } from '@/services/mockData/treatiesMockData';

export const useTreatiesApi = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setLoading(true);
        const data = await mockTreatiesService.getDatabases();
        setDatabases(data as any);
      } catch {
        setError('Failed to fetch databases');
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  const getTreatiesByDatabase = async (databaseId: string): Promise<Treaty[]> => {
    try {
      return await mockTreatiesService.getTreatiesByDatabase(databaseId);
    } catch {
      setError('Failed to fetch treaties');
      return [];
    }
  };

  const searchTreaties = async (query: string): Promise<Treaty[]> => {
    try {
      return await mockTreatiesService.searchTreaties(query);
    } catch {
      setError('Failed to search treaties');
      return [];
    }
  };

  return {
    databases,
    loading,
    error,
    getTreatiesByDatabase,
    searchTreaties,
  };
};