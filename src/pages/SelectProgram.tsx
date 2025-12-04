// ============= components/CRMSearchUI.tsx =============
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedProgram } from '@/features/selectProgram';
import type { Program } from '@/features/selectProgram/types';
import {
  Header,
  ProgramList,
  SearchResults,
} from '@/features/selectProgram/components';
import { useNavigate } from 'react-router-dom';
import { resetStepper } from '@/features/sidebarStepper/stepperSlice';
import {
  useRecentPrograms,
  useSearchBySubscribeReference,
  useSearchByArrowId,
  useSearchByCedantName
} from '@/features/selectProgram/api/useProgramApi';

type SearchType = 'subscribe' | 'arrow' | 'cedant' | null;

const SelectProgram: React.FC = () => {
  const [subscribeRef, setSubscribeRef] = useState('');
  const [arrowId, setArrowId] = useState('');
  const [cedantName, setCedantName] = useState('');

  const [activeSearchType, setActiveSearchType] = useState<SearchType>(null);
  const [activeQuery, setActiveQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: recentPrograms,
    isLoading: loadingRecent,
    error: errorRecent,
  } = useRecentPrograms(5);

  // Specific search hooks
  const {
    data: subscribeResults,
    isLoading: loadingSubscribe,
    error: errorSubscribe,
  } = useSearchBySubscribeReference(activeSearchType === 'subscribe' ? activeQuery : '');

  const {
    data: arrowResults,
    isLoading: loadingArrow,
    error: errorArrow,
  } = useSearchByArrowId(activeSearchType === 'arrow' ? activeQuery : '');

  const {
    data: cedantResults,
    isLoading: loadingCedant,
    error: errorCedant,
  } = useSearchByCedantName(activeSearchType === 'cedant' ? activeQuery : '');

  // Determine current display state
  const isSearching = !!activeSearchType && !!activeQuery;

  const currentSearchResults =
    activeSearchType === 'subscribe' ? subscribeResults :
    activeSearchType === 'arrow' ? arrowResults :
    activeSearchType === 'cedant' ? cedantResults : [];

  const isLoading = loadingRecent || (isSearching && (loadingSubscribe || loadingArrow || loadingCedant));

  const currentError =
    errorRecent ? (errorRecent as Error).message :
    activeSearchType === 'subscribe' && errorSubscribe ? (errorSubscribe as Error).message :
    activeSearchType === 'arrow' && errorArrow ? (errorArrow as Error).message :
    activeSearchType === 'cedant' && errorCedant ? (errorCedant as Error).message : null;

  const handleProgramSelect = async (program: Program) => {
    try {
      dispatch(resetStepper());
      await dispatch(setSelectedProgram(program));
      navigate(`/${program.id}/database`);
      handleClearSearch();
    } catch (err) {
      console.error('Error selecting program:', err);
    }
  };

  const handleSearch = (type: SearchType, query: string) => {
    if (query.trim()) {
      setActiveSearchType(type);
      setActiveQuery(query);

      // Clear other inputs to avoid confusion
      if (type !== 'subscribe') setSubscribeRef('');
      if (type !== 'arrow') setArrowId('');
      if (type !== 'cedant') setCedantName('');
    }
  };

  const handleClearSearch = () => {
    setSubscribeRef('');
    setArrowId('');
    setCedantName('');
    setActiveSearchType(null);
    setActiveQuery('');
  };

  return (
    <div className="min-h-[calc(100vh-54px)] bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-8 py-4 flex-1 flex flex-col justify-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
          {/* Left Column: Search Forms */}
          <div className="space-y-10">
            {/* Search by Subscribe Reference */}
            <div>
              <label className="block text-[#004D40] font-bold text-lg mb-3">Search by Subscribe Reference</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow hover:shadow-md transition-shadow">
                <input
                  type="text"
                  placeholder="e.g. PoAoG41250PG"
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-300 text-lg"
                  value={subscribeRef}
                  onChange={(e) => setSubscribeRef(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch('subscribe', subscribeRef)}
                />
                <button
                  onClick={() => handleSearch('subscribe', subscribeRef)}
                  className="bg-[#1B5E20] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#144a18] transition-colors text-lg"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search by Arrow ID */}
            <div>
              <label className="block text-[#004D40] font-bold text-lg mb-3">Search by Arrow ID</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow hover:shadow-md transition-shadow">
                <input
                  type="text"
                  placeholder="e.g. 107311"
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-300 text-lg"
                  value={arrowId}
                  onChange={(e) => setArrowId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch('arrow', arrowId)}
                />
                <button
                  onClick={() => handleSearch('arrow', arrowId)}
                  className="bg-[#1B5E20] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#144a18] transition-colors text-lg"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search by Cedant Name */}
            <div>
              <label className="block text-[#004D40] font-bold text-lg mb-3">Search by Cedant Name</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow hover:shadow-md transition-shadow">
                <input
                  type="text"
                  placeholder="e.g. AUTO OWNERS"
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-300 text-lg"
                  value={cedantName}
                  onChange={(e) => setCedantName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch('cedant', cedantName)}
                />
                <button
                  onClick={() => handleSearch('cedant', cedantName)}
                  className="bg-[#1B5E20] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#144a18] transition-colors text-lg"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results or Recent */}
          <div className="pt-2">
            {currentError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {currentError}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E20]"></div>
              </div>
            ) : (
              <>
                {isSearching ? (
                  <SearchResults
                    results={currentSearchResults || []}
                    searchQuery={activeQuery}
                    onSelect={handleProgramSelect}
                    onClear={handleClearSearch}
                  />
                ) : (
                  <div className="mt-8">
                    <ProgramList
                      programs={recentPrograms || []}
                      onSelect={handleProgramSelect}
                      title="Or, select a recent program"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProgram;

