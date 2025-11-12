// ============= components/CRMSearchUI.tsx =============
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedProgram, type Program } from '../app/slices/programSlice';
import Header from '../components/SewarchProgram/Header';
import SearchBar from '../components/SewarchProgram/SearchBar';
import SearchResults from '../components/SewarchProgram/SearchResults';
import ProgramList from '../components/SewarchProgram/ProgramList';
import { useNavigate } from 'react-router-dom';
import { unifiedProgramService } from '../api/services/unifiedProgramService';

const CRMSearchUI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Program[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentPrograms, setRecentPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch recent programs on component mount
  useEffect(() => {
    fetchRecentPrograms();
  }, []);

  const fetchRecentPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const programs = await unifiedProgramService.getRecentPrograms(5);
      setRecentPrograms(programs);
    } catch (err) {
      console.error('Error fetching recent programs:', err);
      setError('Failed to load recent programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsSearching(true);

      const results = await unifiedProgramService.searchPrograms(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching programs:', err);
      setError('Failed to search programs');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgramSelect = async (program: Program) => {
    try {
      await dispatch(setSelectedProgram(program));
      navigate(`/stepper?id=${program.id}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    } catch (err) {
      console.error('Error selecting program:', err);
      setError('Failed to select program');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-(--color-secondary)">
      <Header />
      <div className="max-w-5xl mx-auto p-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
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
                results={searchResults}
                searchQuery={searchQuery}
                onSelect={handleProgramSelect}
                onClear={handleClearSearch}
              />
            ) : (
              <ProgramList
                programs={recentPrograms}
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

export default CRMSearchUI;
