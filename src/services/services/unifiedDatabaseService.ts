// ============= api/services/unifiedDatabaseService.ts =============
import { API_CONFIG } from '../config/apiConfig';
import { databaseService } from './databaseService';
import { mockDatabaseService } from '../mocks/mockDatabaseService';
import type { Database } from '../mockData/databaseMockData';
import type { DatabaseResponse, DatabaseSearchParams } from './databaseService';

/**
 * Unified service that switches between mock and real API based on configuration
 * This allows seamless transition from dummy to real API
 */
class UnifiedDatabaseService {
  /**
   * Get all databases with optional filtering and pagination
   */
  async getAllDatabases(params?: DatabaseSearchParams): Promise<DatabaseResponse> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.getAllDatabases(params);
      }
      return await databaseService.getAllDatabases(params);
    } catch (error) {
      console.error('Error fetching all databases:', error);
      throw error;
    }
  }

  /**
   * Search databases by name
   */
  async searchDatabases(query: string): Promise<Database[]> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.searchDatabases(query);
      }
      return await databaseService.searchDatabases(query);
    } catch (error) {
      console.error('Error searching databases:', error);
      throw error;
    }
  }

  /**
   * Get database by ID
   */
  async getDatabaseById(id: string): Promise<Database> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.getDatabaseById(id);
      }
      return await databaseService.getDatabaseById(id);
    } catch (error) {
      console.error(`Error fetching database ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple databases by IDs
   */
  async getDatabasesByIds(ids: string[]): Promise<Database[]> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.getDatabasesByIds(ids);
      }
      return await databaseService.getDatabasesByIds(ids);
    } catch (error) {
      console.error('Error fetching databases by IDs:', error);
      throw error;
    }
  }

  /**
   * Get databases by status
   */
  async getDatabasesByStatus(status: 'active' | 'archived' | 'maintenance'): Promise<Database[]> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.getDatabasesByStatus(status);
      }
      return await databaseService.getDatabasesByStatus(status);
    } catch (error) {
      console.error('Error fetching databases by status:', error);
      throw error;
    }
  }

  /**
   * Create new database
   */
  async createDatabase(database: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>): Promise<Database> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.createDatabase(database);
      }
      return await databaseService.createDatabase(database);
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }

  /**
   * Update database
   */
  async updateDatabase(id: string, database: Partial<Database>): Promise<Database> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.updateDatabase(id, database);
      }
      return await databaseService.updateDatabase(id, database);
    } catch (error) {
      console.error(`Error updating database ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete database
   */
  async deleteDatabase(id: string): Promise<void> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.deleteDatabase(id);
      }
      return await databaseService.deleteDatabase(id);
    } catch (error) {
      console.error(`Error deleting database ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    totalDatabases: number;
    totalSize: string;
    totalPortfolios: number;
    totalTreaties: number;
    totalCedants: number;
  }> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockDatabaseService.getDatabaseStats();
      }
      return await databaseService.getDatabaseStats() as {
        totalDatabases: number;
        totalSize: string;
        totalPortfolios: number;
        totalTreaties: number;
        totalCedants: number;
      };
    } catch (error) {
      console.error('Error fetching database stats:', error);
      throw error;
    }
  }
}

export const unifiedDatabaseService = new UnifiedDatabaseService();