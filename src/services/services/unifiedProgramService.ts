// ============= api/services/unifiedProgramService.ts =============
import { API_CONFIG } from '../config/apiConfig';
import { programService } from './programService';
import { mockApiService } from '../mocks/mockApiService';
import type { Program } from '@/features/searchProgram/types';
import type { ProgramResponse, ProgramSearchParams } from './programService';

/**
 * Unified service that switches between mock and real API based on configuration
 * This allows seamless transition from dummy to real API
 */
class UnifiedProgramService {


  /**
   * Get all programs with optional pagination
   */
  async getAllPrograms(params?: ProgramSearchParams): Promise<ProgramResponse> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.getAllPrograms(params);
      }
      return await programService.getAllPrograms(params);
    } catch (error) {
      console.error('Error fetching all programs:', error);
      throw error;
    }
  }

  /**
   * Search programs by query
   */
  async searchPrograms(query: string): Promise<Program[]> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.searchPrograms(query);
      }
      return await programService.searchPrograms(query);
    } catch (error) {
      console.error('Error searching programs:', error);
      throw error;
    }
  }

  /**
   * Get program by ID
   */
  async getProgramById(id: string): Promise<Program> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.getProgramById(id);
      }
      return await programService.getProgramById(id);
    } catch (error) {
      console.error(`Error fetching program ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get recent programs
   */
  async getRecentPrograms(limit: number = 5): Promise<Program[]> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.getRecentPrograms(limit);
      }
      return await programService.getRecentPrograms(limit);
    } catch (error) {
      console.error('Error fetching recent programs:', error);
      throw error;
    }
  }

  /**
   * Create new program
   */
  async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.createProgram(program);
      }
      return await programService.createProgram(program);
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  }

  /**
   * Update program
   */
  async updateProgram(id: string, program: Partial<Program>): Promise<Program> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.updateProgram(id, program);
      }
      return await programService.updateProgram(id, program);
    } catch (error) {
      console.error(`Error updating program ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete program
   */
  async deleteProgram(id: string): Promise<void> {
    try {
      if (API_CONFIG.useDummyAPI) {
        return await mockApiService.deleteProgram(id);
      }
      return await programService.deleteProgram(id);
    } catch (error) {
      console.error(`Error deleting program ${id}:`, error);
      throw error;
    }
  }
}

export const unifiedProgramService = new UnifiedProgramService();