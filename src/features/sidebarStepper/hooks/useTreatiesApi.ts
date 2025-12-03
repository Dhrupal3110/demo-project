// useTreatiesApi.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockTreatiesService } from '@/services/mocks/mockTreatiesService';
import type { Treaty } from '@/services/mockData/treatiesMockData';
import { queryKeys } from '@/utils/queryKeys';

export const useTreatiesDatabases = () => {
  return useQuery({
    queryKey: queryKeys.treaties.databases(),
    queryFn: () => mockTreatiesService.getDatabases(),
  });
};

export const useTreatiesByDatabase = (databaseId: string) => {
  return useQuery({
    queryKey: queryKeys.treaties.byDatabase(databaseId),
    queryFn: () => mockTreatiesService.getTreatiesByDatabase(databaseId),
    enabled: !!databaseId,
    initialData: [],
  });
};

export const useSearchTreaties = (query: string) => {
  return useQuery({
    queryKey: queryKeys.treaties.search(query),
    queryFn: () => mockTreatiesService.searchTreaties(query),
    enabled: !!query.trim(),
    initialData: [],
  });
};

export const useTreatiesApi = () => {
  const queryClient = useQueryClient();
  const databasesQuery = useTreatiesDatabases();

  const getTreatiesByDatabase = async (databaseId: string): Promise<Treaty[]> => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.treaties.byDatabase(databaseId),
      queryFn: () => mockTreatiesService.getTreatiesByDatabase(databaseId),
    });
  };

  const searchTreaties = async (query: string): Promise<Treaty[]> => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.treaties.search(query),
      queryFn: () => mockTreatiesService.searchTreaties(query),
    });
  };

  return {
    databases: databasesQuery.data || [],
    loading: databasesQuery.isLoading,
    error: databasesQuery.error ? (databasesQuery.error as Error).message : null,
    getTreatiesByDatabase,
    searchTreaties,
  };
};