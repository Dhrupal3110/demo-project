// ============= api/services/databaseService.ts =============
import { apiClient } from './client/apiClient';
import type { Database } from './mockData/databaseMockData';
import { API_CONFIG } from './config/apiConfig';
import { mockDatabaseService } from './mocks/mockDatabaseService';

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
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.getAllDatabases(params);
    }
    const response = await apiClient.get<DatabaseResponse>('/databases', { params });
    return response;
  },

  /**
   * Search databases by name
   */
  searchDatabases: async (query: string): Promise<Database[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.searchDatabases(query);
    }
    const response = await apiClient.get<{ data: Database[] }>('/databases/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Get database by ID
   */
  getDatabaseById: async (id: string): Promise<Database> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.getDatabaseById(id);
    }
    const response = await apiClient.get<{ data: Database }>(`/databases/${id}`);
    return response.data;
  },

  /**
   * Get multiple databases by IDs
   */
  getDatabasesByIds: async (ids: string[]): Promise<Database[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.getDatabasesByIds(ids);
    }
    const response = await apiClient.post<{ data: Database[] }>('/databases/bulk', { ids });
    return response.data;
  },

  /**
   * Get databases by status
   */
  getDatabasesByStatus: async (status: 'active' | 'archived' | 'maintenance'): Promise<Database[]> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.getDatabasesByStatus(status);
    }
    const response = await apiClient.get<{ data: Database[] }>('/databases/by-status', {
      params: { status }
    });
    return response.data;
  },

  /**
   * Create new database
   */
  createDatabase: async (database: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>): Promise<Database> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.createDatabase(database);
    }
    const response = await apiClient.post<{ data: Database }>('/databases', database);
    return response.data;
  },

  /**
   * Update database
   */
  updateDatabase: async (id: string, database: Partial<Database>): Promise<Database> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.updateDatabase(id, database);
    }
    const response = await apiClient.put<{ data: Database }>(`/databases/${id}`, database);
    return response.data;
  },

  /**
   * Delete database
   */
  deleteDatabase: async (id: string): Promise<void> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.deleteDatabase(id);
    }
    await apiClient.delete(`/databases/${id}`);
  },

  /**
   * Get database statistics
   */
  getDatabaseStats: async (): Promise<unknown> => {
    if (API_CONFIG.useDummyAPI) {
      return mockDatabaseService.getDatabaseStats();
    }
    const response = await apiClient.get('/databases/stats');
    return response;
  },
};