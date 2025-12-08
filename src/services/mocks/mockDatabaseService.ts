// ============= api/mocks/mockDatabaseService.ts =============
import type { Database } from '../mockData/databaseMockData';
import { mockDatabases, simulateDelay } from '../mockData/databaseMockData';

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

class MockDatabaseService {
  private databases: Database[] = [...mockDatabases];

  /**
   * Get all databases with optional filtering and pagination
   */
  async getAllDatabases(params?: DatabaseSearchParams): Promise<DatabaseResponse> {
    await simulateDelay(600);
    
    let filteredDatabases = [...this.databases];

    // Filter by status if provided
    if (params?.status) {
      filteredDatabases = filteredDatabases.filter(
        (db) => db.status === params.status
      );
    }

    // Filter by search query if provided
    if (params?.query) {
      const lowerQuery = params.query.toLowerCase();
      filteredDatabases = filteredDatabases.filter(
        (db) =>
          db.name.toLowerCase().includes(lowerQuery) ||
          db.id.toLowerCase().includes(lowerQuery)
      );
    }

    // Pagination
    const { limit = 10, offset = 0 } = params || {};
    const paginatedData = filteredDatabases.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      total: filteredDatabases.length,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  /**
   * Search databases by name
   */
  async searchDatabases(query: string): Promise<Database[]> {
    await simulateDelay(400);
    
    if (!query.trim()) {
      return this.databases;
    }

    const lowerQuery = query.toLowerCase();
    return this.databases.filter((db) =>
      db.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get database by ID
   */
  async getDatabaseById(id: string): Promise<Database> {
    await simulateDelay(300);
    
    const database = this.databases.find((db) => db.id === id);
    
    if (!database) {
      throw new Error(`Database with ID ${id} not found`);
    }
    
    return database;
  }

  /**
   * Get multiple databases by IDs
   */
  async getDatabasesByIds(ids: string[]): Promise<Database[]> {
    await simulateDelay(400);
    
    return this.databases.filter((db) => ids.includes(db.id));
  }

  /**
   * Get databases by status
   */
  async getDatabasesByStatus(status: 'active' | 'archived' | 'maintenance'): Promise<Database[]> {
    await simulateDelay(500);
    
    return this.databases.filter((db) => db.status === status);
  }

  /**
   * Create new database
   */
  async createDatabase(database: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>): Promise<Database> {
    await simulateDelay(700);
    
    const newDatabase: Database = {
      ...database,
      id: String(this.databases.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: database.status || 'active',
    };
    
    this.databases.push(newDatabase);
    return newDatabase;
  }

  /**
   * Update database
   */
  async updateDatabase(id: string, updates: Partial<Database>): Promise<Database> {
    await simulateDelay(500);
    
    const index = this.databases.findIndex((db) => db.id === id);
    
    if (index === -1) {
      throw new Error(`Database with ID ${id} not found`);
    }
    
    const updatedDatabase = {
      ...this.databases[index],
      ...updates,
      id: this.databases[index].id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    this.databases[index] = updatedDatabase;
    return updatedDatabase;
  }

  /**
   * Delete database
   */
  async deleteDatabase(id: string): Promise<void> {
    await simulateDelay(400);
    
    const index = this.databases.findIndex((db) => db.id === id);
    
    if (index === -1) {
      throw new Error(`Database with ID ${id} not found`);
    }
    
    this.databases.splice(index, 1);
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
    await simulateDelay(300);
    
    const totalPortfolios = this.databases.reduce((sum, db) => sum + db.portfolios, 0);
    const totalTreaties = this.databases.reduce((sum, db) => sum + db.treaties, 0);
    const totalCedants = this.databases.reduce((sum, db) => sum + db.cedants, 0);
    
    return {
      totalDatabases: this.databases.length,
      totalSize: this.calculateTotalSize(),
      totalPortfolios,
      totalTreaties,
      totalCedants,
    };
  }

  /**
   * Calculate total size of all databases
   */
  private calculateTotalSize(): string {
    let totalMB = 0;
    
    this.databases.forEach((db) => {
      const size = db.size.toLowerCase();
      if (size.includes('gb')) {
        totalMB += parseFloat(size) * 1024;
      } else if (size.includes('mb')) {
        totalMB += parseFloat(size);
      }
    });
    
    if (totalMB >= 1024) {
      return `${(totalMB / 1024).toFixed(2)} GB`;
    }
    return `${totalMB.toFixed(2)} MB`;
  }

  /**
   * Reset mock data to initial state
   */
  resetMockData(): void {
    this.databases = [...mockDatabases];
  }
}

export const mockDatabaseService = new MockDatabaseService();