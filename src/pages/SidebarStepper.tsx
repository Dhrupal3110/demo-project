import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarStepper/Sidebar';
import SteperHeader from '../components/SidebarStepper/SteperHeader';
import DatabaseForm from '../components/SidebarStepper/DatabaseForm';
import PortfolioForm from '../components/SidebarStepper/PortfolioForm';
import { stepsData } from '../static/stepsData';
import DemandSurgeForm from '../components/SidebarStepper/DemandSurgeForm';
import TreatiesForm from '../components/SidebarStepper/TreatiesForm';
import PortfolioPerilCoverageForm from '../components/SidebarStepper/PortfolioPerilCoverageForm';
import PortfolioRegionCoverageForm from '../components/SidebarStepper/PortfolioRegionCoverageForm';
import TreatyPerilCoverageForm from '../components/SidebarStepper/TreatyPerilCoverageForm';
import TreatyRegionCoverageForm from '../components/SidebarStepper/TreatyRegionCoverageForm';
import LinkPortfoliosTreatiesForm from '../components/SidebarStepper/LinkPortfoliosTreatiesForm';
import ReviewAnalyses from '../components/SidebarStepper/ReviewAnalyses';
import type { RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSidebarStepperApi } from '../hooks/useSidebarStepperApi';
import { setSelectedProgram } from '../app/slices/programSlice';

interface FormData {
  [key: number]: Record<string, any>;
}

interface ValidationErrors {
  [key: string]: string;
}

const SidebarStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(2);
  const [localFormData, setLocalFormData] = useState<FormData>({});
  const [currentStepData, setCurrentStepData] = useState<Record<string, any>>(
    {}
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('id');

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
    submitting,
    saveStepData,
    validateStep,
    submitAllData,
    resetForm,
  } = useSidebarStepperApi();

  useEffect(() => {
    if (apiFormData && Object.keys(apiFormData).length > 0) {
      setLocalFormData(apiFormData);
      if (apiFormData[activeStep]) {
        setCurrentStepData(apiFormData[activeStep]);
      }
    }
  }, [apiFormData]);

  useEffect(() => {
    if (selectedProgram) {
      setLocalFormData((prev) => ({
        ...prev,
        1: { program: selectedProgram },
      }));
      return;
    }

    if (programId && allPrograms?.length > 0) {
      const foundProgram = allPrograms.find((p) => p.id === programId);

      if (foundProgram) {
        setLocalFormData((prev) => ({
          ...prev,
          1: { program: foundProgram },
        }));
        dispatch(setSelectedProgram(foundProgram));
      } else {
        toast.error('Invalid program ID');
        navigate('/');
      }
    }

    if (!programId) {
      navigate('/');
    }
  }, [selectedProgram, programId, allPrograms, navigate]);

  const handleNext = async (): Promise<void> => {
    try {
      // Validate current step
      const validation = await validateStep(activeStep, currentStepData);

      if (!validation.valid) {
        setErrors(validation.errors);
        toast.error('Please fix the errors before proceeding');
        return;
      }

      setErrors({});

      // Save current step data
      await saveStepData(activeStep, currentStepData);

      // Update local state
      setLocalFormData((prev) => ({
        ...prev,
        [activeStep]: currentStepData,
      }));

      // STEP 7 SPECIAL CASE: if NO treaties → jump to final page
      if (activeStep === 7) {
        const treaties = currentStepData?.treaties || [];

        if (treaties.length === 0) {
          const finalStep = stepsData.length;

          setActiveStep(finalStep);
          setMaxVisitedStep((prev) => Math.max(prev, finalStep));
          setCurrentStepData(localFormData[finalStep] || {});
          return;
        }
      }

      // Normal next step behavior
      if (activeStep < stepsData.length) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        setMaxVisitedStep((prev) => Math.max(prev, nextStep));
        setCurrentStepData(localFormData[nextStep] || {});
      } else {
        // Final Submit
        const submitResponse = await submitAllData(localFormData);

        if (submitResponse.success) {
          setSubmissionId(submitResponse.submissionId);
          setIsSubmitted(true);
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

  const handlePrevious = (): void => {
    if (activeStep === 2) {
      navigate('/');
      return;
    }

    // STEP FINAL → SPECIAL CASE: if NO treaties → jump back to STEP 7
    if (activeStep === stepsData.length) {
      const step7Data = localFormData[7] || {};
      const treaties = step7Data?.treaties || [];

      if (treaties.length === 0) {
        const prevStep = 7;
        setActiveStep(prevStep);
        setCurrentStepData(localFormData[prevStep] || {});
        setErrors({});
        return;
      }
    }

    if (activeStep > 2) {
      setLocalFormData((prev) => ({
        ...prev,
        [activeStep]: currentStepData,
      }));

      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      setCurrentStepData(localFormData[prevStep] || {});
      setErrors({});
    }
  };

  const handleSidebarClick = (stepId: number): void => {
    if (activeStep === stepId) return;
    if (stepId === 1) {
      navigate('/');
    }
    if (stepId <= maxVisitedStep) {
      setLocalFormData((prev) => ({ ...prev, [activeStep]: currentStepData }));
      setActiveStep(stepId);
      setCurrentStepData(localFormData[stepId] || {});
      setErrors({});
    }
  };

  const renderStepForm = () => {
    const props = {
      data: currentStepData,
      onChange: setCurrentStepData,
      errors,
    };
    switch (activeStep) {
      case 1:
      case 2:
        return <DatabaseForm {...props} />;
      case 3:
        return <PortfolioForm {...props} />;
      case 4:
        return <DemandSurgeForm {...props} />;
      case 5:
        return <PortfolioPerilCoverageForm {...props} />;
      case 6:
        return <PortfolioRegionCoverageForm {...props} />;
      case 7:
        return <TreatiesForm {...props} />;
      case 8:
        return <TreatyPerilCoverageForm {...props} />;
      case 9:
        return <TreatyRegionCoverageForm {...props} />;
      case 10:
        return <LinkPortfoliosTreatiesForm {...props} />;
      case 11:
        return <ReviewAnalyses {...props} />;
      default:
        return (
          <div>
            <p>Step {activeStep} not found</p>
          </div>
        );
    }
  };

  const handleResetAndCreateNew = async () => {
    try {
      await resetForm();
      setIsSubmitted(false);
      setActiveStep(2);
      setMaxVisitedStep(2);
      setLocalFormData({});
      setCurrentStepData({});
      setErrors({});
      setSubmissionId('');
      navigate('/');
      toast.success('Form reset successfully');
    } catch (err) {
      console.error('Error resetting form:', err);
      toast.error('Failed to reset form');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-gray-600 text-lg">Loading form data...</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-center">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex h-screen from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-scaleIn">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-white animate-checkmark" />
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-3 h-3 bg-blue-400 rounded-full animate-confetti-1"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-confetti-2"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-confetti-3"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-pink-400 rounded-full animate-confetti-4"></div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
                Submission Successful!
              </h2>
              <p
                className="text-lg text-gray-600 mb-8 animate-fadeInUp"
                style={{ animationDelay: '0.1s' }}
              >
                Your configuration has been successfully submitted and is now
                being processed.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div
                  className="bg-blue-50 rounded-lg p-4 animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Submission ID
                  </p>
                  <p className="text-xs text-gray-600 font-mono">
                    #{submissionId}
                  </p>
                </div>
                <div
                  className="bg-purple-50 rounded-lg p-4 animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <svg
                    className="w-6 h-6 text-purple-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Processing Time
                  </p>
                  <p className="text-xs text-gray-600">Estimated 2-5 minutes</p>
                </div>
              </div>
              <div
                className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeInUp"
                style={{ animationDelay: '0.4s' }}
              >
                <button
                  onClick={handleResetAndCreateNew}
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Create New Submission'}
                </button>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  View Details
                </button>
              </div>
              <div
                className="mt-8 pt-6 border-t border-gray-200 animate-fadeInUp"
                style={{ animationDelay: '0.5s' }}
              >
                <p className="text-sm text-gray-500">
                  You will receive a confirmation email shortly at your
                  registered email address.
                </p>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes checkmark { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
          @keyframes confetti-1 { 0% { transform: translate(0, 0) scale(0); } 50% { transform: translate(-30px, -30px) scale(1); } 100% { transform: translate(-40px, -40px) scale(0); } }
          @keyframes confetti-2 { 0% { transform: translate(0, 0) scale(0); } 50% { transform: translate(30px, -30px) scale(1); } 100% { transform: translate(40px, -40px) scale(0); } }
          @keyframes confetti-3 { 0% { transform: translate(0, 0) scale(0); } 50% { transform: translate(-30px, 30px) scale(1); } 100% { transform: translate(-40px, 40px) scale(0); } }
          @keyframes confetti-4 { 0% { transform: translate(0, 0) scale(0); } 50% { transform: translate(30px, 30px) scale(1); } 100% { transform: translate(40px, 40px) scale(0); } }
          .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
          .animate-checkmark { animation: checkmark 0.6s ease-out 0.3s both; }
          .animate-confetti-1 { animation: confetti-1 1.5s ease-out infinite; }
          .animate-confetti-2 { animation: confetti-2 1.5s ease-out 0.2s infinite; }
          .animate-confetti-3 { animation: confetti-3 1.5s ease-out 0.4s infinite; }
          .animate-confetti-4 { animation: confetti-4 1.5s ease-out 0.6s infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeStep={activeStep}
        maxVisitedStep={maxVisitedStep}
        stepsData={stepsData}
        formData={localFormData}
        handleSidebarClick={handleSidebarClick}
      />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <SteperHeader
          activeStep={activeStep}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          isSaving={saving}
        />
        <div className="flex flex-col p-6 gap-4 animate-fadeIn">
          <div className="flex-1 p-6">{renderStepForm()}</div>
        </div>
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default SidebarStepper;
