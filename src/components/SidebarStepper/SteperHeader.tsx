import { Moon, Play, Redo2, Sun, Undo2 } from 'lucide-react';
import { stepsData } from '../../static/stepsData';
import { useTheme } from '../../context/ThemeContext';

interface SteperHeaderProps {
  handlePrevious: () => void;
  handleNext: () => void;
  activeStep: number;
  isSaving: boolean;
}

const SteperHeader = ({
  handlePrevious,
  handleNext,
  activeStep,
  isSaving,
}: SteperHeaderProps) => {
  const { mode, name, toggleMode, setName } = useTheme();
  return (
    <div className="flex items-center justify-between bg-(--color-primary) px-6 py-3">
      <button
        id="stepper-prev"
        onClick={handlePrevious}
        disabled={activeStep === 1}
        className={`px-4 py-2 rounded-full border border-white text-white text-sm font-medium flex items-center gap-2 ${activeStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-(--color-primary)'}`}
      >
        <Undo2 size={18} />
        {stepsData[activeStep - 1]?.prev}
      </button>

      <div className="flex items-center gap-3">
      <div className="flex items-center bg-(--color-primary-overlay) rounded-full p-1">
          <button
            onClick={() => setName('default')}
          className={`px-3 py-1 rounded-full text-sm ${name === 'default' ? 'bg-white text-(--color-primary-dark)' : 'text-white hover:bg-(--color-primary-overlay-hover)'}`}
            aria-pressed={name === 'default'}
          >
            Default
          </button>
          <button
            onClick={() => setName('sompo')}
          className={`px-3 py-1 rounded-full text-sm ${name === 'sompo' ? 'bg-white text-(--color-primary-dark)' : 'text-white hover:bg-(--color-primary-overlay-hover)'}`}
            aria-pressed={name === 'sompo'}
          >
            Sompo
          </button>
        </div>
        <button
          onClick={toggleMode}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-full bg-white text-(--color-primary-dark) flex items-center justify-center hover:bg-gray-100"
          title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <button
        id="stepper-next"
        onClick={handleNext}
        disabled={isSaving}
        className={`px-4 py-2 rounded-full bg-white text-(--color-primary-dark) text-sm font-medium flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
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
    </div>
  );
};

export default SteperHeader;
