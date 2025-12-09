// useTreatiesApi.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { treatiesService } from '@/services/treatiesService';
import type { Treaty } from '@/services/mockData/treatiesMockData';
import { queryKeys } from '@/utils/queryKeys';

export const useTreatiesDatabases = () => {
  return useQuery({
    queryKey: queryKeys.treaties.databases(),
    queryFn: () => treatiesService.getDatabases(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useTreatiesByDatabase = (databaseId: string) => {
  return useQuery({
    queryKey: queryKeys.treaties.byDatabase(databaseId),
    queryFn: () => treatiesService.getTreatiesByDatabase(databaseId),
    enabled: !!databaseId,
    placeholderData: [],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useSearchTreaties = (query: string) => {
  return useQuery({
    queryKey: queryKeys.treaties.search(query),
    queryFn: () => treatiesService.searchTreaties(query),
    enabled: !!query.trim(),
    placeholderData: [],
  });
};

export const useTreatiesApi = () => {
  const queryClient = useQueryClient();
  const databasesQuery = useTreatiesDatabases();

  const getTreatiesByDatabase = async (databaseId: string): Promise<Treaty[]> => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.treaties.byDatabase(databaseId),
      queryFn: () => treatiesService.getTreatiesByDatabase(databaseId),
    });
  };

  const searchTreaties = async (query: string): Promise<Treaty[]> => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.treaties.search(query),
      queryFn: () => treatiesService.searchTreaties(query),
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