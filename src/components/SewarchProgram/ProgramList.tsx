import React from 'react';
import { Play } from 'lucide-react';
import type { Program } from '../../app/slices/programSlice';

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

      <div className="space-y-2">
        {programs.map((program, index) => (
          <div
            key={index}
            onClick={() => onSelect(program)}
            className="w-full text-16 cursor-pointer flex items-center justify-between px-4 py-3 border-b-2 border-(--color-border) hover:bg-(--color-secondary) transition-colors group"
          >
            <span className="text-left text-(--color-text-secondary) text-sm font-medium">
              <span className="font-medium">{program.id}</span>
              {', '}
              <span>{program.name}</span>
            </span>
            <Play
              size={24}
              fill="currentColor"
              className="w-5 h-5 text-(--color-primary) group-hover:translate-x-1 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
