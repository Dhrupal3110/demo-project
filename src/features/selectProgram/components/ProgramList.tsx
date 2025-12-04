import React from 'react';
import { Play } from 'lucide-react';

import type { Program } from '@/features/selectProgram';

interface ProgramListProps {
  programs: Program[];
  onSelect: (program: Program) => void;
  title: string;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  onSelect,
  title,
}) => {
  return (
    <div>
      <p className="text-16 text-(--color-text-muted) mb-3 ms-3 font-medium">
        {title}
      </p>

      <div className="space-y-0">
        {programs.map((program, index) => (
          <div
            key={index}
            className="w-full text-16 flex items-center justify-between px-4 py-1 border-b-2 border-(--color-border) transition-colors"
          >
            <span className="text-left text-(--color-primary-dark) text-sm font-medium">
              {[
                program.arrowId,
                program.subscribeReference,
                program.cedantName,
                program.name
              ].filter(Boolean).join(', ')}
            </span>
            <button
              onClick={() => onSelect(program)}
              className="cursor-pointer hover:scale-110 transition-transform p-1"
            >
              <Play
                size={24}
                fill="currentColor"
                className="w-5 h-5 text-(--color-primary)"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
