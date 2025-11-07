// ============= api/services/programService.ts =============
import { apiClient } from '../client/apiClient';
import type { Program } from '../../app/slices/programSlice';

export interface ProgramSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}

export interface ProgramResponse {
  data: Program[];
  total: number;
  page: number;
  pageSize: number;
}

export const programService = {
  /**
   * Get all programs with optional pagination
   */
  getAllPrograms: async (params?: ProgramSearchParams): Promise<ProgramResponse> => {
    const response = await apiClient.get<ProgramResponse>('/programs', { params });
    return response;
  },

  /**
   * Search programs by query
   */
  searchPrograms: async (query: string): Promise<Program[]> => {
    const response = await apiClient.get<{ data: Program[] }>('/programs/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Get program by ID
   */
  getProgramById: async (id: string): Promise<Program> => {
    const response = await apiClient.get<{ data: Program }>(`/programs/${id}`);
    return response.data;
  },

  /**
   * Get recent programs
   */
  getRecentPrograms: async (limit: number = 5): Promise<Program[]> => {
    const response = await apiClient.get<{ data: Program[] }>('/programs/recent', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Create new program
   */
  createProgram: async (program: Omit<Program, 'id'>): Promise<Program> => {
    const response = await apiClient.post<{ data: Program }>('/programs', program);
    return response.data;
  },

  /**
   * Update program
   */
  updateProgram: async (id: string, program: Partial<Program>): Promise<Program> => {
    const response = await apiClient.put<{ data: Program }>(`/programs/${id}`, program);
    return response.data;
  },

  /**
   * Delete program
   */
  deleteProgram: async (id: string): Promise<void> => {
    await apiClient.delete(`/programs/${id}`);
  }
};