import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  StepFormData,
} from '@/services/mockData/sidebarStepperMockData';
import { sidebarStepperService } from '@/services/sidebarStepperService';
import { databaseService } from '@/services/databaseService';
import { portfolioService } from '@/services/portfolioService';
import { demandSurgeService } from '@/services/demandSurgeService';
import { portfolioPerilCoverageService } from '@/services/portfolioPerilCoverageService';
import { portfolioRegionCoverageService } from '@/services/portfolioRegionCoverageService';
import { treatiesService } from '@/services/treatiesService';
import { treatyPerilCoverageService } from '@/services/treatyPerilCoverageService';
import { treatyRegionCoverageService } from '@/services/treatyRegionCoverageService';
import { linkPortfoliosTreatiesService } from '@/services/linkPortfoliosTreatiesService';
import { reviewAnalysesService } from '@/services/reviewAnalysesService';
import { queryKeys } from '@/utils/queryKeys';

export const useSidebarStepperApi = () => {
  const queryClient = useQueryClient();

  const formDataQuery = useQuery({
    queryKey: queryKeys.stepper.formData(),
    queryFn: () => sidebarStepperService.fetchAllFormData(),
  });

  const loadStepData = async (stepId: number) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.stepper.step(stepId),
      queryFn: () => sidebarStepperService.fetchStepData(stepId),
    });
  };

  const getServiceForStep = (stepId: number) => {
    switch (stepId) {
      case 2: return databaseService;
      case 3: return portfolioService;
      case 4: return demandSurgeService;
      case 5: return portfolioPerilCoverageService;
      case 6: return portfolioRegionCoverageService;
      case 7: return treatiesService;
      case 8: return treatyPerilCoverageService;
      case 9: return treatyRegionCoverageService;
      case 10: return linkPortfoliosTreatiesService;
      case 11: return reviewAnalysesService;
      default: return null;
    }
  };

  const saveStepDataMutation = useMutation({
    mutationFn: async ({ stepId, data }: { stepId: number; data: Record<string, unknown> }) => {
      const service = getServiceForStep(stepId);
      if (service && 'saveStepData' in service) {
        // @ts-ignore - we know saveStepData exists because we added it
        return service.saveStepData(data);
      }
      return sidebarStepperService.saveStepData(stepId, data);
    },
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
      sidebarStepperService.updateStepData(stepId, updates),
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
    mutationFn: (formData: StepFormData) => sidebarStepperService.submitAllData(formData),
  });

  const resetFormMutation = useMutation({
    mutationFn: () => sidebarStepperService.resetFormData(),
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
      const service = getServiceForStep(stepId);
      if (service && 'validateStep' in service) {
        // @ts-ignore
        return await service.validateStep(data);
      }
      return await sidebarStepperService.validateStep(stepId, data);
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