// usePortfolioApi.ts
import { useState, useEffect } from 'react';
import type { Database } from '../api/mockData/databaseMockData';
import { mockPortfolioService } from '../api/mocks/mockPortfolioService';


export const usePortfolioApi = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockPortfolioService.getDatabases();
      setDatabases(data as any);
    } catch (err) {
      setError('Failed to fetch databases');
    } finally {
      setLoading(false);
    }
  };

  const getDatabaseById = async (id: string): Promise<any> => {
    try {
      return await mockPortfolioService.getDatabaseById(id);
    } catch (err) {
      setError('Failed to fetch database');
      return undefined;
    }
  };

  const searchPortfolios = async (query: string): Promise<any> => {
    try {
      return await mockPortfolioService.searchPortfolios(query);
    } catch (err) {
      setError('Failed to search portfolios');
      return [];
    }
  };

  return {
    databases,
    loading,
    error,
    fetchDatabases,
    getDatabaseById,
    searchPortfolios,
  };
};