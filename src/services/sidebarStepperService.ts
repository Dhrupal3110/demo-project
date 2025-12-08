// ============= api/services/sidebarStepperService.ts =============
import { apiClient } from './client/apiClient';
import { API_CONFIG } from './config/apiConfig';
import { mockStepperService } from './mocks/mockSidebarStepperService';
import type {
    SaveResponse,
    StepFormData,
    SubmitResponse,
} from '@/services/mockData/sidebarStepperMockData';

export const sidebarStepperService = {
    fetchStepData: async (stepId: number): Promise<Record<string, unknown>> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.fetchStepData(stepId);
        }
        const response = await apiClient.get<{ data: Record<string, unknown> }>(`/stepper/steps/${stepId}`);
        return response.data;
    },

    fetchAllFormData: async (): Promise<StepFormData> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.fetchAllFormData();
        }
        const response = await apiClient.get<{ data: StepFormData }>('/stepper/data');
        return response.data;
    },

    saveStepData: async (stepId: number, data: Record<string, unknown>): Promise<SaveResponse> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.saveStepData(stepId, data);
        }
        const response = await apiClient.post<SaveResponse>(`/stepper/steps/${stepId}`, data);
        return response;
    },

    updateStepData: async (stepId: number, updates: Partial<Record<string, unknown>>): Promise<SaveResponse> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.updateStepData(stepId, updates);
        }
        const response = await apiClient.patch<SaveResponse>(`/stepper/steps/${stepId}`, updates);
        return response;
    },

    submitAllData: async (formData: StepFormData): Promise<SubmitResponse> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.submitAllData(formData);
        }
        const response = await apiClient.post<SubmitResponse>('/stepper/submit', formData);
        return response;
    },

    validateStep: async (stepId: number, data: Record<string, unknown>): Promise<{ valid: boolean; errors: Record<string, string> }> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.validateStep(stepId, data);
        }
        const response = await apiClient.post<{ valid: boolean; errors: Record<string, string> }>(`/stepper/steps/${stepId}/validate`, data);
        return response;
    },

    resetFormData: async (): Promise<void> => {
        if (API_CONFIG.useDummyAPI) {
            return mockStepperService.resetFormData();
        }
        await apiClient.post('/stepper/reset');
    },
};
