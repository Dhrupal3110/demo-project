import React from 'react';
import ProgramList from './ProgramList';

import type { Program } from '@/features/searchProgram';

interface SearchResultsProps {
  results: Program[];
  searchQuery: string;
  onSelect: (program: Program) => void;
  onClear: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  onSelect,
  onClear,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-(--color-text-secondary)">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
        <button
          onClick={onClear}
          className="text-sm text-(--color-accent) hover:text-(--color-primary-dark) font-medium"
        >
          Clear Search
        </button>
      </div>

      {results.length > 0 ? (
        <ProgramList programs={results} onSelect={onSelect} title="" />
      ) : (
        <div className="text-center py-8 text-(--color-text-muted)">
          <p>No results found for "{searchQuery}"</p>
          <p className="text-sm mt-2">Try a different search term</p>
        </div>
      )}
    </>
  );
};

export default SearchResults;
