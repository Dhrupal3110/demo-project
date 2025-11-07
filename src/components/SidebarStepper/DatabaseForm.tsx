// ============= components/DatabaseForm.tsx =============
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAllDatabases, useSearchDatabases } from '../../hooks/useDatabaseApi';
import type { Database } from '../../api/mocks/databaseMockData';

interface ValidationErrors {
  databases?: string;
}

const DatabaseForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Use hooks for API calls
  const {
    data: allDatabases,
    loading: loadingAll,
    error: errorAll,
    fetchDatabases,
  } = useAllDatabases();
  console.log(allDatabases, 'allDatabases');

  const {
    data: searchResults,
    loading: loadingSearch,
    error: errorSearch,
    searchDatabases,
    clearSearch,
  } = useSearchDatabases();

  // Fetch all databases on mount
  useEffect(() => {
    fetchDatabases();
  }, [fetchDatabases]);

  // Determine which databases to display
  const displayDatabases = searchQuery.trim()
    ? searchResults || []
    : allDatabases || [];

  const isLoading = loadingAll || loadingSearch;
  const error = errorAll || errorSearch;

  // Handle search with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      clearSearch();
      return;
    }

    const timer = setTimeout(() => {
      searchDatabases(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, searchDatabases, clearSearch]);

  const handleCheckboxChange = (database: Database) => {
    const current = data.databases || [];
    const isSelected = current.some((db: Database) => db.id === database.id);
    const updated = isSelected
      ? current.filter((db: Database) => db.id !== database.id)
      : [...current, database];
    onChange({ ...data, databases: updated });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2 - Select databases
        </h2>

        <div className="relative mb-4 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Database name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
            </div>
          )}
        </div>

        {/* Selected count display */}
        {data.databases && data.databases.length > 0 && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700">
              <strong>{data.databases.length}</strong> database
              {data.databases.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !displayDatabases.length && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading databases...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayDatabases.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No databases found</p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search query
          </p>
        </div>
      )}

      {/* Database Table */}
      {displayDatabases.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700"></th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Portfolios
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Treaties
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Cedants
                </th>
              </tr>
            </thead>
            <tbody>
              {displayDatabases.map((db: Database, index: number) => (
                <tr
                  key={db.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={(data.databases || []).some(
                        (database: Database) => database.id === db.id
                      )}
                      onChange={() => handleCheckboxChange(db)}
                      className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-900">{db.name}</td>
                  <td className="py-3 px-4 text-gray-700">{db.size}</td>
                  <td className="py-3 px-4 text-gray-700">{db.portfolios}</td>
                  <td className="py-3 px-4 text-gray-700">{db.treaties}</td>
                  <td className="py-3 px-4 text-gray-700">{db.cedants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Validation Error */}
      {errors.databases && (
        <p className="text-red-500 text-sm mt-2">{errors.databases}</p>
      )}
    </div>
  );
};

export default DatabaseForm;
