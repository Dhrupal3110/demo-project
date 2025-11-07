import React from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { clearSelectedProgram } from '../../app/slices/programSlice';

const SelectedProgram: React.FC = () => {
  const dispatch = useDispatch();
  const selectedProgram = useSelector(
    (state: RootState) => state.program.selectedProgram
  );

  if (!selectedProgram) return null;

  return (
    <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-teal-900 mb-1">Selected Program</h3>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{selectedProgram.id}</span>
            {' - '}
            <span>{selectedProgram.name}</span>
          </p>
        </div>
        <button
          onClick={() => dispatch(clearSelectedProgram())}
          className="text-teal-600 hover:text-teal-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SelectedProgram;
