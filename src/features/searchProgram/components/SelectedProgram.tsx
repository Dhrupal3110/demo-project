import React from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '@/app/store';
import { clearSelectedProgram } from '@/features/searchProgram';

const SelectedProgram: React.FC = () => {
  const dispatch = useDispatch();
  const selectedProgram = useSelector(
    (state: RootState) => state.program.selectedProgram
  );

  if (!selectedProgram) return null;

  return (
    <div className="mb-6 p-4 bg-(--color-accent-bg) border border-(--color-accent-border) rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-(--color-accent) mb-1">
            Selected Program
          </h3>
          <p className="text-sm text-(--color-text-secondary)">
            <span className="font-medium">{selectedProgram.id}</span>
            {' - '}
            <span>{selectedProgram.name}</span>
          </p>
        </div>
        <button
          onClick={() => dispatch(clearSelectedProgram())}
          className="text-(--color-accent) hover:text-(--color-primary-dark)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SelectedProgram;
