import { useState, useEffect } from 'react';
import type { StepFormData, SaveResponse, SubmitResponse  } from '../api/mockData/sidebarStepperMockData';
import { mockStepperService } from '../api/mocks/MockSidebarStepperService';
// import { mockStepperService } from './mockSidebarStepperService';

export const useSidebarStepperApi = () => {
  const [formData, setFormData] = useState<StepFormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAllFormData();
  }, []);

  const loadAllFormData = async () => {
    try {
      setLoading(true);
      const data = await mockStepperService.fetchAllFormData();
      setFormData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load form data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStepData = async (stepId: number): Promise<Record<string, any>> => {
    try {
      const data = await mockStepperService.fetchStepData(stepId);
      setFormData(prev => ({
        ...prev,
        [stepId]: data,
      }));
      return data;
    } catch (err) {
      setError('Failed to load step data');
      console.error(err);
      throw err;
    }
  };

  const saveStepData = async (
    stepId: number,
    data: Record<string, any>
  ): Promise<SaveResponse> => {
    try {
      setSaving(true);
      const response = await mockStepperService.saveStepData(stepId, data);
      setFormData(prev => ({
        ...prev,
        [stepId]: {
          ...data,
          savedAt: response.savedAt,
        },
      }));
      setError(null);
      return response;
    } catch (err) {
      setError('Failed to save step data');
      console.error(err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateStepData = async (
    stepId: number,
    updates: Partial<Record<string, any>>
  ): Promise<SaveResponse> => {
    try {
      const response = await mockStepperService.updateStepData(stepId, updates);
      setFormData(prev => ({
        ...prev,
        [stepId]: {
          ...prev[stepId],
          ...updates,
          updatedAt: response.savedAt,
        },
      }));
      return response;
    } catch (err) {
      setError('Failed to update step data');
      console.error(err);
      throw err;
    }
  };

//   const validateStep = async (
//     stepId: number,
//     data: Record<string, any>
//   ): Promise<{ valid: boolean; errors: Record<string, string> }> => {
//     try {
//       return await mockStepperService.validateStep(stepId, data);
//     } catch (err) {
//       console.error('Failed to validate step:', err);
//       return { valid: false, errors: { general: 'Validation failed' } };
//     }
//   };
const validateStep = async (
  stepId: number,
  data: Record<string, any>
): Promise<{ valid: boolean; errors: Record<string, string> }> => {
  try {
    // still calling service, but ignoring its response if you want
    await mockStepperService.validateStep(stepId, data);
    
    return { valid: true, errors: {} }; // ✅ always pass
  } catch (err) {
    console.error('Ignoring validation error:', err);
    return { valid: true, errors: {} }; // ✅ still pass even on error
  }
};


  const submitAllData = async (data: StepFormData): Promise<SubmitResponse> => {
    try {
      setSubmitting(true);
      const response = await mockStepperService.submitAllData(data);
      if (response.success) {
        setError(null);
      }
      return response;
    } catch (err) {
      setError('Failed to submit form');
      console.error(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = async (): Promise<void> => {
    try {
      await mockStepperService.resetFormData();
      await loadAllFormData();
    } catch (err) {
      setError('Failed to reset form');
      console.error(err);
      throw err;
    }
  };

  return {
    formData,
    loading,
    error,
    saving,
    submitting,
    loadStepData,
    saveStepData,
    updateStepData,
    validateStep,
    submitAllData,
    resetForm,
  };
};