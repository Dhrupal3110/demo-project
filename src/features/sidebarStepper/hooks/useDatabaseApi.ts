// ============= hooks/useDatabaseApi.ts =============
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedDatabaseService } from '@/services/services/unifiedDatabaseService';
import type { Database } from '@/services/mockData/databaseMockData';
import type { DatabaseSearchParams } from '@/services/services/databaseService';
import { queryKeys } from '@/utils/queryKeys';

/**
 * Hook for fetching all databases
 */
export const useAllDatabases = (autoFetch = false, params?: DatabaseSearchParams) => {
  return useQuery({
    queryKey: queryKeys.databases.list(params),
    queryFn: () => unifiedDatabaseService.getAllDatabases(params),
    enabled: autoFetch,
  });
};

/**
 * Hook for searching databases
 */
export const useSearchDatabases = (query: string) => {
  return useQuery({
    queryKey: queryKeys.databases.search(query),
    queryFn: () => unifiedDatabaseService.searchDatabases(query),
    enabled: !!query.trim(),
  });
};

/**
 * Hook for fetching a single database
 */
export const useDatabaseById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.databases.detail(id),
    queryFn: () => unifiedDatabaseService.getDatabaseById(id),
    enabled: !!id,
  });
};

/**
 * Hook for fetching multiple databases by IDs
 */
export const useDatabasesByIds = (ids: string[]) => {
  return useQuery({
    queryKey: queryKeys.databases.detailsByIds(ids),
    queryFn: () => unifiedDatabaseService.getDatabasesByIds(ids),
    enabled: ids.length > 0,
    initialData: [],
  });
};

/**
 * Hook for database statistics
 */
export const useDatabaseStats = (autoFetch = false) => {
  return useQuery({
    queryKey: queryKeys.databases.stats(),
    queryFn: () => unifiedDatabaseService.getDatabaseStats(),
    enabled: autoFetch,
  });
};

/**
 * Hook for creating/updating/deleting databases
 */
export const useDatabaseMutations = () => {
  const queryClient = useQueryClient();

  const createDatabase = useMutation({
    mutationFn: (database: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>) =>
      unifiedDatabaseService.createDatabase(database),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.databases.all });
    },
  });

  const updateDatabase = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Database> }) =>
      unifiedDatabaseService.updateDatabase(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.databases.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.databases.detail(data.id) });
    },
  });

  const deleteDatabase = useMutation({
    mutationFn: (id: string) => unifiedDatabaseService.deleteDatabase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.databases.all });
    },
  });

  return {
    createDatabase,
    updateDatabase,
    deleteDatabase,
  };
};