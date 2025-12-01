import React from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import {
  resetStepper,
} from '@/features/sidebarStepper/stepperSlice';
import { useSidebarStepperApi } from '@/features/sidebarStepper';
import toast from 'react-hot-toast';

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { programId } = useParams<{ programId: string }>();
  const { submissionId } = useSelector(
    (state: RootState) => state.stepper
  );
  const { resetForm, submitting } = useSidebarStepperApi();

  const handleResetAndCreateNew = async () => {
    try {
      await resetForm();
      dispatch(resetStepper());
      navigate('/');
      toast.success('Form reset successfully');
    } catch (err) {
      console.error('Error resetting form:', err);
      toast.error('Failed to reset form');
    }
  };

  const handleViewDetails = () => {
    // Just navigate back to the review page. 
    // The Redux state should still hold the form data unless explicitly cleared.
    // We do NOT dispatch setIsSubmitted(false) here if it triggers a reset elsewhere, 
    // but usually it's just a UI flag. 
    // However, if we want to "edit" or "view" the submitted data, we should go to the review step.
    
    if (programId) {
       navigate(`/${programId}/review`);
    } else {
       navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen from-(--color-info-bg) via-indigo-50 to-(--color-accent-bg)">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-(--color-surface) rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-scaleIn">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-(--color-success-bg) rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-20 h-20 bg-(--color-success) rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-(--color-primary-text) animate-checkmark" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-(--color-info) rounded-full animate-confetti-1"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-(--color-accent) rounded-full animate-confetti-2"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-(--color-warning) rounded-full animate-confetti-3"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-(--color-error) rounded-full animate-confetti-4"></div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-(--color-text) mb-4 animate-fadeInUp">
              Submission Successful!
            </h2>
            <p
              className="text-lg text-(--color-text-secondary) mb-8 animate-fadeInUp"
              style={{ animationDelay: '0.1s' }}
            >
              Your configuration has been successfully submitted and is now being
              processed.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div
                className="bg-(--color-info-bg) rounded-lg p-4 animate-fadeInUp"
                style={{ animationDelay: '0.2s' }}
              >
                <FileText className="w-6 h-6 text-(--color-info) mx-auto mb-2" />
                <p className="text-sm font-semibold text-(--color-text) mb-1">
                  Submission ID
                </p>
                <p className="text-xs text-(--color-text-secondary) font-mono">
                  #{submissionId}
                </p>
              </div>
              <div
                className="bg-(--color-accent-bg) rounded-lg p-4 animate-fadeInUp"
                style={{ animationDelay: '0.3s' }}
              >
                <svg
                  className="w-6 h-6 text-(--color-accent) mx-auto mb-2"
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
                <p className="text-sm font-semibold text-(--color-text) mb-1">
                  Processing Time
                </p>
                <p className="text-xs text-(--color-text-secondary)">
                  Estimated 2-5 minutes
                </p>
              </div>
            </div>
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              <button
                onClick={handleResetAndCreateNew}
                disabled={submitting}
                className="px-6 py-3 bg-(--color-primary) text-(--color-primary-text) rounded-lg font-medium hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Create New Submission'}
              </button>
              <button
                onClick={handleViewDetails}
                className="px-6 py-3 bg-(--color-surface) text-(--color-text-secondary) border-2 border-(--color-border) rounded-lg font-medium hover:bg-(--color-secondary)"
              >
                View Details
              </button>
            </div>
            <div
              className="mt-8 pt-6 border-t border-(--color-border) animate-fadeInUp"
              style={{ animationDelay: '0.5s' }}
            >
              <p className="text-sm text-(--color-text-muted)">
                You will receive a confirmation email shortly at your registered
                email address.
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
};

export default SubmissionSuccess;
