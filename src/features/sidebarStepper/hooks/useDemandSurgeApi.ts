// useDemandSurgeApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DemandSurgeItem } from '@/services/mockData/demandSurgeMockData';
import { demandSurgeService } from '@/services/demandSurgeService';
import { queryKeys } from '@/utils/queryKeys';

export const useDemandSurgeItems = () => {
  return useQuery({
    queryKey: queryKeys.demandSurge.items(),
    queryFn: () => demandSurgeService.getDemandSurgeItems(),
  });
};

export const useDemandSurgeApi = () => {
  const queryClient = useQueryClient();
  const itemsQuery = useDemandSurgeItems();

  const updateDemandSurgeItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DemandSurgeItem> }) =>
      demandSurgeService.updateDemandSurgeItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.demandSurge.items() });
    },
  });

  const updateDemandSurgeItem = async (id: string, updates: Partial<DemandSurgeItem>) => {
    try {
      return await updateDemandSurgeItemMutation.mutateAsync({ id, updates });
    } catch {
      return undefined;
    }
  };

  const searchDemandSurgeItems = async (databaseQuery: string, portfolioQuery: string) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.demandSurge.search(databaseQuery, portfolioQuery),
      queryFn: () => demandSurgeService.searchDemandSurgeItems(databaseQuery, portfolioQuery),
    });
  };

  return {
    items: itemsQuery.data || [],
    loading: itemsQuery.isLoading,
    error: itemsQuery.error ? (itemsQuery.error as Error).message : null,
    fetchDemandSurgeItems: itemsQuery.refetch,
    updateDemandSurgeItem,
    searchDemandSurgeItems,
  };
};