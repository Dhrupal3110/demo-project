// ============= hooks/useDatabaseApi.ts =============
import { useState, useCallback, useEffect } from 'react';
import { unifiedDatabaseService } from '../api/services/unifiedDatabaseService';
import type { Database } from '../api/mockData/databaseMockData';
import type { DatabaseSearchParams } from '../api/services/databaseService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching all databases
 */
export const useAllDatabases = (autoFetch = false, params?: DatabaseSearchParams) => {
  const [state, setState] = useState<UseApiState<Database[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchDatabases = useCallback(async (fetchParams?: DatabaseSearchParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await unifiedDatabaseService.getAllDatabases(fetchParams || params);
      setState({ data: response.data, loading: false, error: null });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch databases';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchDatabases();
    }
  }, [autoFetch, fetchDatabases]);

  return { ...state, fetchDatabases, refetch: fetchDatabases };
};

/**
 * Hook for searching databases
 */
export const useSearchDatabases = () => {
  const [state, setState] = useState<UseApiState<Database[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const searchDatabases = useCallback(async (query: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const results = await unifiedDatabaseService.searchDatabases(query);
      setState({ data: results, loading: false, error: null });
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  const clearSearch = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, searchDatabases, clearSearch };
};

/**
 * Hook for fetching a single database
 */
export const useDatabaseById = () => {
  const [state, setState] = useState<UseApiState<Database>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchDatabase = useCallback(async (id: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const database = await unifiedDatabaseService.getDatabaseById(id);
      setState({ data: database, loading: false, error: null });
      return database;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch database';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, fetchDatabase };
};

/**
 * Hook for fetching multiple databases by IDs
 */
export const useDatabasesByIds = () => {
  const [state, setState] = useState<UseApiState<Database[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchDatabasesByIds = useCallback(async (ids: string[]) => {
    if (!ids.length) {
      setState({ data: [], loading: false, error: null });
      return [];
    }

    setState({ data: null, loading: true, error: null });
    try {
      const databases = await unifiedDatabaseService.getDatabasesByIds(ids);
      setState({ data: databases, loading: false, error: null });
      return databases;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch databases';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, fetchDatabasesByIds };
};

/**
 * Hook for database statistics
 */
export const useDatabaseStats = (autoFetch = false) => {
  const [state, setState] = useState<UseApiState<{
    totalDatabases: number;
    totalSize: string;
    totalPortfolios: number;
    totalTreaties: number;
    totalCedants: number;
  }>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const stats = await unifiedDatabaseService.getDatabaseStats();
      setState({ data: stats, loading: false, error: null });
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return { ...state, fetchStats, refetch: fetchStats };
};

/**
 * Hook for creating/updating/deleting databases
 */
export const useDatabaseMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDatabase = useCallback(async (database: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newDatabase = await unifiedDatabaseService.createDatabase(database);
      setLoading(false);
      return newDatabase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create database';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateDatabase = useCallback(async (id: string, updates: Partial<Database>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDatabase = await unifiedDatabaseService.updateDatabase(id, updates);
      setLoading(false);
      return updatedDatabase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update database';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const deleteDatabase = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await unifiedDatabaseService.deleteDatabase(id);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete database';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    createDatabase,
    updateDatabase,
    deleteDatabase,
  };
};