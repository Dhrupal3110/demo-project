// ============= api/services/programService.ts =============
import { apiClient } from './client/apiClient';
import type { Program } from '@/features/selectProgram/types';
import { API_CONFIG } from './config/apiConfig';
import { mockApiService } from './mocks/mockApiService';

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
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.getAllPrograms(params);
    }
    const response = await apiClient.get<ProgramResponse>('/programs', { params });
    return response;
  },

  /**
   * Search programs by query
   */
  searchPrograms: async (query: string): Promise<Program[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.searchPrograms(query);
    }
    const response = await apiClient.get<{ data: Program[] }>('/programs/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Search programs by Subscribe Reference
   */
  searchBySubscribeReference: async (reference: string): Promise<Program[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.searchBySubscribeReference(reference);
    }
    const response = await apiClient.get<{ data: Program[] }>('/programs/search/subscribe-reference', {
      params: { q: reference }
    });
    return response.data;
  },

  /**
   * Search programs by Arrow ID
   */
  searchByArrowId: async (arrowId: string): Promise<Program[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.searchByArrowId(arrowId);
    }
    const response = await apiClient.get<{ data: Program[] }>('/programs/search/arrow-id', {
      params: { q: arrowId }
    });
    return response.data;
  },

  /**
   * Search programs by Cedant Name
   */
  searchByCedantName: async (name: string): Promise<Program[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.searchByCedantName(name);
    }
    const response = await apiClient.get<{ data: Program[] }>('/programs/search/cedant-name', {
      params: { q: name }
    });
    return response.data;
  },

  /**
   * Get program by ID
   */
  getProgramById: async (id: string): Promise<Program> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.getProgramById(id);
    }
    const response = await apiClient.get<{ data: Program }>(`/programs/${id}`);
    return response.data;
  },

  /**
   * Get recent programs
   */
  getRecentPrograms: async (limit: number = 5): Promise<Program[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.getRecentPrograms(limit);
    }
    const response = await apiClient.get<{ data: Program[] }>('/programs/recent', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Create new program
   */
  createProgram: async (program: Omit<Program, 'id'>): Promise<Program> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.createProgram(program);
    }
    const response = await apiClient.post<{ data: Program }>('/programs', program);
    return response.data;
  },

  /**
   * Update program
   */
  updateProgram: async (id: string, program: Partial<Program>): Promise<Program> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.updateProgram(id, program);
    }
    const response = await apiClient.put<{ data: Program }>(`/programs/${id}`, program);
    return response.data;
  },

  /**
   * Delete program
   */
  deleteProgram: async (id: string): Promise<void> => {
    if (API_CONFIG.useDummyAPI) {
      return mockApiService.deleteProgram(id);
    }
    await apiClient.delete(`/programs/${id}`);
  }
};