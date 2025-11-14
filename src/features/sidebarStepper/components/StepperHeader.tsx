import { Play, Redo2, Undo2 } from 'lucide-react';
import { stepsData } from '@/features/sidebarStepper/constants/stepsData';
import { ThemeToggler } from '@/components/common';

interface StepperHeaderProps {
  handlePrevious: () => void;
  handleNext: () => void;
  activeStep: number;
  isSaving: boolean;
}

const StepperHeader = ({
  handlePrevious,
  handleNext,
  activeStep,
  isSaving,
}: StepperHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-(--color-primary-header) px-6 py-[13px] ">
      <button
        id="stepper-prev"
        onClick={handlePrevious}
        className={`px-4 py-2 rounded-full bg-(--color-surface) text-(--color-primary-dark) text-sm font-medium flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-(--color-hover)'}`}
      >
        <Undo2 size={18} />
        {stepsData[activeStep - 1]?.prev}
      </button>

      {/* <button
          onClick={toggleMode}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-full bg-(--color-surface) text-(--color-primary-dark) flex items-center justify-center hover:bg-(--color-hover)"
          title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button> */}

      <div className="flex items-center gap-3">
        <button
          id="stepper-next"
          onClick={handleNext}
          disabled={isSaving}
          className={`px-4 py-2 rounded-full bg-(--color-surface) text-(--color-primary-dark) text-sm font-medium flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-(--color-hover)'}`}
        >
          {isSaving
            ? 'Saving...'
            : activeStep === stepsData.length
              ? 'Submit'
              : stepsData[activeStep]?.title}
          {activeStep === stepsData.length ? (
            <Play
              size={24}
              fill="currentColor"
              className="w-5 h-5 text-(--color-primary) group-hover:translate-x-1 transition-transform"
            />
          ) : (
            <Redo2 size={18} />
          )}
        </button>
        <ThemeToggler />
      </div>
    </div>
  );
};

export default StepperHeader;
