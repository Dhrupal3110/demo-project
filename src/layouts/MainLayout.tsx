import React, { useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import {
  Sidebar,
  StepperHeader,
  stepsData,
  useSidebarStepperApi,
} from '@/features/sidebarStepper';
import type { RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setSelectedProgram } from '@/features/selectProgram';
import {
  setActiveStep,
  setMaxVisitedStep,
  setStepData,
  setAllFormData,
  setErrors,
  setIsSubmitted,
  setSubmissionId,
  resetStepper,
} from '@/features/sidebarStepper/stepperSlice';

const stepRoutes: Record<number, string> = {
  2: 'database',
  3: 'portfolio',
  4: 'demand-surge',
  5: 'portfolio-peril',
  6: 'portfolio-region',
  7: 'treaties',
  8: 'treaty-peril',
  9: 'treaty-region',
  10: 'link-portfolios',
  11: 'review',
};

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { programId } = useParams<{ programId: string }>();

  const {
    activeStep,
    maxVisitedStep,
    formData: localFormData,
  } = useSelector((state: RootState) => state.stepper);

  const selectedProgram = useSelector(
    (state: RootState) => state.program.selectedProgram
  );
  const allPrograms = useSelector(
    (state: RootState) => state.program.allPrograms
  );

  const {
    formData: apiFormData,
    loading,
    error: apiError,
    saving,
    saveStepData,
    validateStep,
    submitAllData,
  } = useSidebarStepperApi();

  // Route-based configuration for save and validate actions
  const routeConfig = useMemo(() => ({
    'database': {
      save: (data: any) => saveStepData(2, data),
      validate: (data: any) => validateStep(2, data),
    },
    'portfolio': {
      save: (data: any) => saveStepData(3, data),
      validate: (data: any) => validateStep(3, data),
    },
    'demand-surge': {
      save: (data: any) => saveStepData(4, data),
      validate: (data: any) => validateStep(4, data),
    },
    'portfolio-peril': {
      save: (data: any) => saveStepData(5, data),
      validate: (data: any) => validateStep(5, data),
    },
    'portfolio-region': {
      save: (data: any) => saveStepData(6, data),
      validate: (data: any) => validateStep(6, data),
    },
    'treaties': {
      save: (data: any) => saveStepData(7, data),
      validate: (data: any) => validateStep(7, data),
    },
    'treaty-peril': {
      save: (data: any) => saveStepData(8, data),
      validate: (data: any) => validateStep(8, data),
    },
    'treaty-region': {
      save: (data: any) => saveStepData(9, data),
      validate: (data: any) => validateStep(9, data),
    },
    'link-portfolios': {
      save: (data: any) => saveStepData(10, data),
      validate: (data: any) => validateStep(10, data),
    },
    'review': {
      save: (data: any) => saveStepData(11, data),
      validate: (data: any) => validateStep(11, data),
    },
  }), [saveStepData, validateStep]);

  // Sync Route with Active Step (URL -> State)
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const stepId = Object.keys(stepRoutes).find(
      (key) => stepRoutes[Number(key)] === path
    );
    if (stepId && Number(stepId) !== activeStep) {
      dispatch(setActiveStep(Number(stepId)));
    }
  }, [location.pathname, dispatch, activeStep]);

  useEffect(() => {
    if (apiFormData && Object.keys(apiFormData).length > 0) {
      dispatch(setAllFormData(apiFormData));
    }
  }, [apiFormData, dispatch]);

  // Validate Session & Sequence on Load
  const toastShownRef = React.useRef(false);

  useEffect(() => {
    if (loading) return;

    // 1. Strict Program Check: If state is lost, force restart
    if (!selectedProgram) {
      navigate('/');
      return;
    }

    // 2. Sequence Check: Ensure previous steps have data
    if (activeStep > 2) {
      const sourceData = apiFormData || localFormData;
      let isSequenceValid = true;

      for (let i = 2; i < activeStep; i++) {
        // Special case: If step 7 has no treaties, steps 8, 9, 10 are skipped (valid to be empty)
        if ([8, 9, 10].includes(i)) {
          const step7Data = sourceData[7];
          const treaties = (step7Data as any)?.treaties;
          const hasTreaties = Array.isArray(treaties) && treaties.length > 0;
          if (!hasTreaties) {
            continue;
          }
        }

        const stepData = sourceData[i];
        if (
          !stepData ||
          (typeof stepData === 'object' && Object.keys(stepData).length === 0)
        ) {
          isSequenceValid = false;
          break;
        }
      }

      if (!isSequenceValid) {
        if (!toastShownRef.current) {
          toast.error('Please complete previous steps first');
          toastShownRef.current = true;
          navigate(`/${programId}/database`);
          
          // Reset ref after navigation completes (approximate)
          setTimeout(() => {
            toastShownRef.current = false;
          }, 1000);
        }
      }
    }
  }, [
    loading,
    selectedProgram,
    activeStep,
    // apiFormData and localFormData can change frequently, but we only care about the check when activeStep changes or loading finishes
    // Removing them from dependencies to avoid re-running on every keystroke/update if activeStep hasn't changed
    // However, we need to check validity if data *arrives* (loading finishes).
    // Let's keep it simple: only run when loading finishes or activeStep changes.
    // We can access the latest data via refs if needed, but here we just want to prevent spam.
    // The main issue is likely re-renders causing the effect to fire multiple times.
    programId,
    navigate,
  ]);

  useEffect(() => {
    // If program changes, reset stepper
    if (selectedProgram && programId && selectedProgram.id !== programId) {
      dispatch(resetStepper());
      dispatch(setStepData({ step: 1, data: { program: { id: programId, name: 'Loading...' } } })); // Temporary placeholder or fetch logic
      // Ideally we should fetch the new program details here if not in allPrograms
    }

    if (selectedProgram) {
      dispatch(setStepData({ step: 1, data: { program: selectedProgram } }));
      return;
    }

    if (programId && allPrograms?.length > 0) {
      const foundProgram = allPrograms.find((p) => p.id === programId);

      if (foundProgram) {
        // If we found a program but it's different from what might have been in state (though covered by first check), set it.
        dispatch(setStepData({ step: 1, data: { program: foundProgram } }));
        dispatch(setSelectedProgram(foundProgram));
      } else {
        // This block might be redundant now due to the strict check above, 
        // but kept for consistency if allPrograms happens to be populated.
        toast.error('Invalid program ID');
        navigate('/');
      }
    }
    
    // Removed the simple !programId check as it's handled by the strict check
  }, [selectedProgram, programId, allPrograms, navigate, dispatch]);

  const currentStepData = localFormData[activeStep] || {};

  const handleNext = async (): Promise<void> => {
    try {
      const currentRoute = stepRoutes[activeStep];
      const handlers = routeConfig[currentRoute as keyof typeof routeConfig];

      if (!handlers) {
        console.error(`No handlers found for route: ${currentRoute}`);
        return;
      }

      // Validate current step
      const validation = await handlers.validate(currentStepData);

      if (!validation.valid) {
        dispatch(setErrors(validation.errors));
        toast.error('Please fix the errors before proceeding');
        return;
      }

      dispatch(setErrors({}));

      // Save current step data
      await handlers.save(currentStepData);

      const finalStep = stepsData.length;

      // STEP 7 SPECIAL CASE: if NO treaties → jump to review page (step 11)
      const treaties = (currentStepData as any)?.treaties;
      const hasTreaties = Array.isArray(treaties) && treaties.length > 0;
      if (activeStep === 7 && !hasTreaties) {
        dispatch(setMaxVisitedStep(finalStep));
        navigate(`/${programId}/${stepRoutes[finalStep]}`);
        return;
      }

      // Normal next step behavior
      if (activeStep < stepsData.length) {
        const nextStep = activeStep + 1;
        dispatch(setMaxVisitedStep(nextStep));
        navigate(`/${programId}/${stepRoutes[nextStep]}`);
      } else {
        // Final Submit
        const submitResponse = await submitAllData(localFormData);

        if (submitResponse.success) {
          dispatch(setSubmissionId(submitResponse.submissionId));
          dispatch(setIsSubmitted(true));
          navigate(`/${programId}/success`);
          toast.success('Form submitted successfully!');
        } else {
          toast.error(submitResponse.message || 'Submission failed');
        }
      }
    } catch (err) {
      console.error('Error in handleNext:', err);
      toast.error('An error occurred while proceeding');
    }
  };

  const handlePrevious = async (): Promise<void> => {
    try {
      const currentRoute = stepRoutes[activeStep];
      const handlers = routeConfig[currentRoute as keyof typeof routeConfig];

      if (handlers) {
        await handlers.save(currentStepData);
      }

      if (activeStep === 2) {
        navigate('/');
        return;
      }

      // STEP FINAL → SPECIAL CASE: if NO treaties → jump back to STEP 7
      if (activeStep === stepsData.length) {
        const step7Data = localFormData[7] || {};
        const treaties = (step7Data as any)?.treaties;
        const hasTreaties = Array.isArray(treaties) && treaties.length > 0;

        if (!hasTreaties) {
          dispatch(setErrors({}));
          navigate(`/${programId}/${stepRoutes[7]}`);
          return;
        }
      }

      if (activeStep > 2) {
        dispatch(setErrors({}));
        navigate(`/${programId}/${stepRoutes[activeStep - 1]}`);
      }
    } catch (err) {
      console.error('Error in handlePrevious:', err);
      toast.error('Failed to save data');
    }
  };

  const handleSidebarClick = async (stepId: number): Promise<void> => {
    if (activeStep === stepId) return;

    try {
      // Check if we can navigate first, but save data regardless if we are about to navigate?
      // Actually, we only save if we are going to navigate.
      const canNavigate = stepId === 1 || stepId <= maxVisitedStep;
      
      if (!canNavigate) return;

      const currentRoute = stepRoutes[activeStep];
      const handlers = routeConfig[currentRoute as keyof typeof routeConfig];

      if (handlers) {
        await handlers.save(currentStepData);
      }

      if (stepId === 1) {
        navigate('/');
        return;
      }
      
      dispatch(setErrors({}));
      navigate(`/${programId}/${stepRoutes[stepId]}`);
    } catch (err) {
      console.error('Error in handleSidebarClick:', err);
      toast.error('Failed to save data');
    }
  };


  if (loading) {
    return (
      <div className="flex h-[calc(100vh-54px)] items-center justify-center ">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-(--color-text-secondary) text-lg">
            Loading form data...
          </span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex h-[calc(100vh-54px)] items-center justify-center ">
        <div className="bg-(--color-error-bg) border border-(--color-error-border) rounded-lg p-6 max-w-md">
          <p className="text-(--color-error) text-center">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-(--color-error) text-(--color-primary-text) rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-[calc(100vh-54px)] ">
      <Sidebar
        activeStep={activeStep}
        maxVisitedStep={maxVisitedStep}
        stepsData={stepsData}
        formData={localFormData}
        handleSidebarClick={handleSidebarClick}
      />
      <main className="flex-1 flex flex-col">
        <StepperHeader
          activeStep={activeStep}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          isSaving={saving}
        />
        <div className="flex flex-col  px-0 gap-4 animate-fadeIn max-h-[calc(100vh-110px)] overflow-y-auto">
          <div className="flex-1 px-6 py-4">
            <Outlet />
          </div>
        </div>
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MainLayout;
