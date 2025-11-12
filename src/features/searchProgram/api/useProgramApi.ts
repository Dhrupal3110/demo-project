// ============= hooks/useProgramApi.ts =============
import { useState, useCallback } from 'react';
import { unifiedProgramService } from '@/services/services/unifiedProgramService';
import type { Program } from '@/features/searchProgram/types';
import type { ProgramSearchParams } from '@/services/services/programService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching all programs
 */
export const useAllPrograms = () => {
  const [state, setState] = useState<UseApiState<Program[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchPrograms = useCallback(async (params?: ProgramSearchParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await unifiedProgramService.getAllPrograms(params);
      setState({ data: response.data, loading: false, error: null });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch programs';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, fetchPrograms };
};

/**
 * Hook for searching programs
 */
export const useSearchPrograms = () => {
  const [state, setState] = useState<UseApiState<Program[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const searchPrograms = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState({ data: [], loading: false, error: null });
      return [];
    }

    setState({ data: null, loading: true, error: null });
    try {
      const results = await unifiedProgramService.searchPrograms(query);
      setState({ data: results, loading: false, error: null });
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, searchPrograms };
};

/**
 * Hook for fetching recent programs
 */
export const useRecentPrograms = () => {
  const [state, setState] = useState<UseApiState<Program[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRecentPrograms = useCallback(async (limit: number = 5) => {
    setState({ data: null, loading: true, error: null });
    try {
      const programs = await unifiedProgramService.getRecentPrograms(limit);
      setState({ data: programs, loading: false, error: null });
      return programs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent programs';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, fetchRecentPrograms };
};

/**
 * Hook for fetching a single program
 */
export const useProgramById = () => {
  const [state, setState] = useState<UseApiState<Program>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchProgram = useCallback(async (id: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const program = await unifiedProgramService.getProgramById(id);
      setState({ data: program, loading: false, error: null });
      return program;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch program';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return { ...state, fetchProgram };
};

/**
 * Hook for creating/updating/deleting programs
 */
export const useProgramMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProgram = useCallback(async (program: Omit<Program, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newProgram = await unifiedProgramService.createProgram(program);
      setLoading(false);
      return newProgram;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create program';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateProgram = useCallback(async (id: string, updates: Partial<Program>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProgram = await unifiedProgramService.updateProgram(id, updates);
      setLoading(false);
      return updatedProgram;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update program';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const deleteProgram = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await unifiedProgramService.deleteProgram(id);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete program';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    createProgram,
    updateProgram,
    deleteProgram,
  };
};