// ============= api/mocks/mockApiService.ts =============
import type { Program } from '@/features/searchProgram/types';
import { mockPrograms, simulateDelay } from '../mockData/programMockData';
import type { ProgramResponse, ProgramSearchParams } from '../services/programService';

class MockApiService {
  private programs: Program[] = [...mockPrograms];

  /**
   * Get all programs with optional pagination
   */
  async getAllPrograms(params?: ProgramSearchParams): Promise<ProgramResponse> {
    await simulateDelay();
    
    const { limit = 10, offset = 0 } = params || {};
    const paginatedData = this.programs.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      total: this.programs.length,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  /**
   * Search programs by query
   */
  async searchPrograms(query: string): Promise<Program[]> {
    await simulateDelay(500);
    
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return this.programs.filter(
      (program) =>
        program.id.toLowerCase().includes(lowerQuery) ||
        program.name.toLowerCase().includes(lowerQuery) ||
        program.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get program by ID
   */
  async getProgramById(id: string): Promise<Program> {
    await simulateDelay(300);
    
    const program = this.programs.find((p) => p.id === id);
    
    if (!program) {
      throw new Error(`Program with ID ${id} not found`);
    }
    
    return program;
  }

  /**
   * Get recent programs
   */
  async getRecentPrograms(limit: number = 5): Promise<Program[]> {
    await simulateDelay(400);
    
    // Sort by updatedAt date (most recent first)
    const sortedPrograms = [...this.programs].sort((a, b) => {
      return new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime();
    });
    
    return sortedPrograms.slice(0, limit);
  }

  /**
   * Create new program
   */
  async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
    await simulateDelay(600);
    
    const newProgram: Program = {
      ...program,
      id: `PRG${String(this.programs.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    this.programs.push(newProgram);
    return newProgram;
  }

  /**
   * Update program
   */
  async updateProgram(id: string, updates: Partial<Program>): Promise<Program> {
    await simulateDelay(500);
    
    const index = this.programs.findIndex((p) => p.id === id);
    
    if (index === -1) {
      throw new Error(`Program with ID ${id} not found`);
    }
    
    const updatedProgram = {
      ...this.programs[index],
      ...updates,
      id: this.programs[index].id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    this.programs[index] = updatedProgram;
    return updatedProgram;
  }

  /**
   * Delete program
   */
  async deleteProgram(id: string): Promise<void> {
    await simulateDelay(400);
    
    const index = this.programs.findIndex((p) => p.id === id);
    
    if (index === -1) {
      throw new Error(`Program with ID ${id} not found`);
    }
    
    this.programs.splice(index, 1);
  }

  /**
   * Reset mock data to initial state
   */
  resetMockData(): void {
    this.programs = [...mockPrograms];
  }
}

export const mockApiService = new MockApiService();