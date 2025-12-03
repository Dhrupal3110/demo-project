// ============= components/CRMSearchUI.tsx =============
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedProgram } from '@/features/selectProgram';
import type { Program } from '@/features/selectProgram/types';
import {
  Header,
  ProgramList,
  SearchBar,
  SearchResults,
} from '@/features/selectProgram/components';
import { useNavigate } from 'react-router-dom';
import { resetStepper } from '@/features/sidebarStepper/stepperSlice';
import { useRecentPrograms, useSearchPrograms } from '@/features/selectProgram/api/useProgramApi';

const SelectProgram: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: recentPrograms,
    isLoading: loadingRecent,
    error: errorRecent,
  } = useRecentPrograms(5);

  const {
    data: searchResults,
    isLoading: loadingSearch,
    error: errorSearch,
  } = useSearchPrograms(debouncedQuery);

  const isSearching = !!debouncedQuery.trim();
  const isLoading = loadingRecent || (isSearching && loadingSearch);
  const error = errorRecent ? (errorRecent as Error).message : errorSearch ? (errorSearch as Error).message : null;

  const handleProgramSelect = async (program: Program) => {
    try {
      dispatch(resetStepper());
      await dispatch(setSelectedProgram(program));
      navigate(`/${program.id}/database`);
      setSearchQuery('');
    } catch (err) {
      console.error('Error selecting program:', err);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-[calc(100vh-54px)]">
      <Header />
      <div className="max-w-5xl mx-auto p-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={() => {}} // Search is automatic now
          onClear={handleClearSearch}
        />

        {error && (
          <div className="mb-4 p-4 bg-(--color-error-bg) border border-(--color-error-border) rounded-lg text-(--color-error)">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-info)"></div>
          </div>
        )}

        {!isLoading && (
          <>
            {isSearching ? (
              <SearchResults
                results={searchResults || []}
                searchQuery={searchQuery}
                onSelect={handleProgramSelect}
                onClear={handleClearSearch}
              />
            ) : (
              <ProgramList
                programs={recentPrograms || []}
                onSelect={handleProgramSelect}
                title="Or, select a recent program"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SelectProgram;

