// usePortfolioApi.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockPortfolioService } from '@/services/mocks/mockPortfolioService';
import { queryKeys } from '@/utils/queryKeys';

export const usePortfolioDatabases = () => {
  return useQuery({
    queryKey: queryKeys.portfolios.databases(),
    queryFn: () => mockPortfolioService.getDatabases(),
  });
};

export const usePortfolioById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.portfolios.detail(id),
    queryFn: () => mockPortfolioService.getDatabaseById(id),
    enabled: !!id,
  });
};

export const useSearchPortfolios = (query: string) => {
  return useQuery({
    queryKey: queryKeys.portfolios.search(query),
    queryFn: () => mockPortfolioService.searchPortfolios(query),
    enabled: !!query.trim(),
  });
};

export const usePortfolioApi = () => {
  const queryClient = useQueryClient();
  const databasesQuery = usePortfolioDatabases();

  const getDatabaseById = async (id: string) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.portfolios.detail(id),
      queryFn: () => mockPortfolioService.getDatabaseById(id),
    });
  };

  const searchPortfolios = async (query: string) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.portfolios.search(query),
      queryFn: () => mockPortfolioService.searchPortfolios(query),
    });
  };

  return {
    databases: databasesQuery.data || [],
    loading: databasesQuery.isLoading,
    error: databasesQuery.error ? (databasesQuery.error as Error).message : null,
    fetchDatabases: databasesQuery.refetch,
    getDatabaseById,
    searchPortfolios,
  };
};