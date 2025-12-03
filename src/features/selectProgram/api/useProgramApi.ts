// ============= hooks/useProgramApi.ts =============
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedProgramService } from '@/services/services/unifiedProgramService';
import type { Program } from '@/features/selectProgram/types';
import type { ProgramSearchParams } from '@/services/services/programService';
import { queryKeys } from '@/utils/queryKeys';

/**
 * Hook for fetching all programs
 */
export const useAllPrograms = (params?: ProgramSearchParams) => {
  return useQuery({
    queryKey: queryKeys.programs.list(params),
    queryFn: () => unifiedProgramService.getAllPrograms(params),
  });
};

/**
 * Hook for searching programs
 */
export const useSearchPrograms = (query: string) => {
  return useQuery({
    queryKey: queryKeys.programs.search(query),
    queryFn: () => unifiedProgramService.searchPrograms(query),
    enabled: !!query.trim(),
  });
};

/**
 * Hook for fetching recent programs
 */
export const useRecentPrograms = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.programs.recent(limit),
    queryFn: () => unifiedProgramService.getRecentPrograms(limit),
  });
};

/**
 * Hook for fetching a single program
 */
export const useProgramById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.programs.detail(id),
    queryFn: () => unifiedProgramService.getProgramById(id),
    enabled: !!id,
  });
};

/**
 * Hook for creating/updating/deleting programs
 */
export const useProgramMutations = () => {
  const queryClient = useQueryClient();

  const createProgram = useMutation({
    mutationFn: (program: Omit<Program, 'id'>) => unifiedProgramService.createProgram(program),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
    },
  });

  const updateProgram = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Program> }) =>
      unifiedProgramService.updateProgram(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(data.id) });
    },
  });

  const deleteProgram = useMutation({
    mutationFn: (id: string) => unifiedProgramService.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
    },
  });

  return {
    createProgram,
    updateProgram,
    deleteProgram,
  };
};