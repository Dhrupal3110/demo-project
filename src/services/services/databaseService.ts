// ============= api/services/databaseService.ts =============
import { apiClient } from '../client/apiClient';
import type { Database } from '../mockData/databaseMockData';

export interface DatabaseSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
  status?: 'active' | 'archived' | 'maintenance';
}

export interface DatabaseResponse {
  data: Database[];
  total: number;
  page: number;
  pageSize: number;
}

export const databaseService = {
  /**
   * Get all databases with optional filtering and pagination
   */
  getAllDatabases: async (params?: DatabaseSearchParams): Promise<DatabaseResponse> => {
    const response = await apiClient.get<DatabaseResponse>('/databases', { params });
    return response;
  },

  /**
   * Search databases by name
   */
  searchDatabases: async (query: string): Promise<Database[]> => {
    const response = await apiClient.get<{ data: Database[] }>('/databases/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Get database by ID
   */
  getDatabaseById: async (id: string): Promise<Database> => {
    const response = await apiClient.get<{ data: Database }>(`/databases/${id}`);
    return response.data;
  },

  /**
   * Get multiple databases by IDs
   */
  getDatabasesByIds: async (ids: string[]): Promise<Database[]> => {
    const response = await apiClient.post<{ data: Database[] }>('/databases/bulk', { ids });
    return response.data;
  },

  /**
   * Get databases by status
   */
  getDatabasesByStatus: async (status: 'active' | 'archived' | 'maintenance'): Promise<Database[]> => {
    const response = await apiClient.get<{ data: Database[] }>('/databases/by-status', {
      params: { status }
    });
    return response.data;
  },

  /**
   * Create new database
   */
  createDatabase: async (database: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>): Promise<Database> => {
    const response = await apiClient.post<{ data: Database }>('/databases', database);
    return response.data;
  },

  /**
   * Update database
   */
  updateDatabase: async (id: string, database: Partial<Database>): Promise<Database> => {
    const response = await apiClient.put<{ data: Database }>(`/databases/${id}`, database);
    return response.data;
  },

  /**
   * Delete database
   */
  deleteDatabase: async (id: string): Promise<void> => {
    await apiClient.delete(`/databases/${id}`);
  },

  /**
   * Get database statistics
   */
  getDatabaseStats: async (): Promise<unknown> => {
    const response = await apiClient.get('/databases/stats');
    return response;
  },
};