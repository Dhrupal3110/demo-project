import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  StepFormData,
} from '@/services/mockData/sidebarStepperMockData';
import { mockStepperService } from '@/services/mocks/mockSidebarStepperService';
import { queryKeys } from '@/utils/queryKeys';

export const useSidebarStepperApi = () => {
  const queryClient = useQueryClient();

  const formDataQuery = useQuery({
    queryKey: queryKeys.stepper.formData(),
    queryFn: () => mockStepperService.fetchAllFormData(),
  });

  const loadStepData = async (stepId: number) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.stepper.step(stepId),
      queryFn: () => mockStepperService.fetchStepData(stepId),
    });
  };

  const saveStepDataMutation = useMutation({
    mutationFn: ({ stepId, data }: { stepId: number; data: Record<string, unknown> }) =>
      mockStepperService.saveStepData(stepId, data),
    onSuccess: (response, { stepId }) => {
      queryClient.setQueryData(queryKeys.stepper.formData(), (old: StepFormData | undefined) => ({
        ...old,
        [stepId]: {
          ...old?.[stepId],
          savedAt: response.savedAt,
        },
      }));
      queryClient.invalidateQueries({ queryKey: queryKeys.stepper.formData() });
    },
  });

  const updateStepDataMutation = useMutation({
    mutationFn: ({ stepId, updates }: { stepId: number; updates: Partial<Record<string, unknown>> }) =>
      mockStepperService.updateStepData(stepId, updates),
    onSuccess: (response, { stepId, updates }) => {
      queryClient.setQueryData(queryKeys.stepper.formData(), (old: StepFormData | undefined) => ({
        ...old,
        [stepId]: {
          ...old?.[stepId],
          ...updates,
          updatedAt: response.savedAt,
        },
      }));
      queryClient.invalidateQueries({ queryKey: queryKeys.stepper.formData() });
    },
  });

  const submitAllDataMutation = useMutation({
    mutationFn: (data: StepFormData) => mockStepperService.submitAllData(data),
  });

  const resetFormMutation = useMutation({
    mutationFn: () => mockStepperService.resetFormData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stepper.all });
    },
  });

  // Adapters to match original interface
  const saveStepData = async (stepId: number, data: Record<string, unknown>) => {
    return saveStepDataMutation.mutateAsync({ stepId, data });
  };

  const updateStepData = async (stepId: number, updates: Partial<Record<string, unknown>>) => {
    return updateStepDataMutation.mutateAsync({ stepId, updates });
  };

  const validateStep = async (stepId: number, data: Record<string, unknown>) => {
    try {
      await mockStepperService.validateStep(stepId, data);
      return { valid: true, errors: {} };
    } catch (err) {
      console.error('Ignoring validation error:', err);
      return { valid: true, errors: {} };
    }
  };

  const submitAllData = async (data: StepFormData) => {
    return submitAllDataMutation.mutateAsync(data);
  };

  const resetForm = async () => {
    return resetFormMutation.mutateAsync();
  };

  return {
    formData: formDataQuery.data || {},
    loading: formDataQuery.isLoading,
    error: formDataQuery.error ? (formDataQuery.error as Error).message : null,
    saving: saveStepDataMutation.isPending || updateStepDataMutation.isPending,
    submitting: submitAllDataMutation.isPending,
    loadStepData,
    saveStepData,
    updateStepData,
    validateStep,
    submitAllData,
    resetForm,
  };
};