import { CheckCircle2, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import logo from '../../assets/logo.png';

interface Step {
  id: number;
  title: string;
}
interface sidebarProps {
  stepsData: Step[];
  activeStep: number;
  maxVisitedStep: number;
  formData: Record<string, any>;
  handleSidebarClick: (stepId: number) => void;
}

const Sidebar = ({
  stepsData,
  activeStep,
  maxVisitedStep,
  formData,
  handleSidebarClick,
}: sidebarProps) => {
  const selectedProgram = useSelector(
    (state: RootState) => state.program.selectedProgram
  );
  return (
    <aside className="w-64 bg-(--color-surface-muted) border-r border-(--color-border) flex flex-col">
      {/* Header */}
      <div className="px-6 py-2 flex items-center  border-b border-(--color-border) ">
        <div className="px-6 flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-12" />
          <h1 className="text-lg font-semibold text-(--color-text)">CRM-UI</h1>
        </div>
      </div>

      {/* Selected Program */}
      <div className="pr-4">
        <div className="p-6 bg-(--color-surface-muted) border-b-2 border-(--color-border-strong)">
          <div className="flex items-start gap-3">
            <FileText className="w-12 h-12 text-(--color-text-secondary) mt-1" />
            <div>
              <>
                <h2 className="text-sm font-semibold  uppercase leading-tight">
                  {selectedProgram?.name || 'AUTO OWNERS INSURANCE COMPANY CAT'}
                </h2>
                <p className="text-sm mt-0.5">{selectedProgram?.id || 20045}</p>
              </>
            </div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 p-4">
        <ol className="space-y-1">
          {stepsData.map((step: Step) => {
            const isActive = activeStep === step.id;
            const isVisited = step.id <= maxVisitedStep;
            const isCompleted = step.id < activeStep && formData[step.id];
            return (
              <li
                key={step.id}
                onClick={() => handleSidebarClick(step.id)}
                className={`px-3 py-2 rounded text-sm transition-all duration-200 flex items-center justify-between font-medium ${
                  isActive
                    ? 'text-(--color-primary) cursor-pointer'
                    : isVisited
                      ? 'hover:bg-(--color-hover) cursor-pointer '
                      : 'opacity-50 cursor-not-allowed text-(--color-text-muted)'
                }`}
              >
                <span className="text-xs">
                  {step.id}. {step.title}
                </span>
                {(isCompleted || step.id == 1) && (
                  <CheckCircle2 className="w-4 h-4 text-(--color-primary-dark)" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
};

export default Sidebar;
