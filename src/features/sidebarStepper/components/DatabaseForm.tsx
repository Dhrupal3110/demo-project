// ============= components/DatabaseForm.tsx =============
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Checkbox, SectionTitle } from '@/components/common';
import {
  useAllDatabases,
  useSearchDatabases,
} from '@/features/sidebarStepper/hooks';
import type { Database } from '@/services/mockData/databaseMockData';

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
        <SectionTitle title="2 - Select databases" />

        <div className="relative mb-4 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Database name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-(--color-primary)"></div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-(--color-error-bg) border border-(--color-error-border) rounded-lg text-(--color-error)">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !displayDatabases.length && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary) mx-auto mb-4"></div>
            <p className="text-(--color-text-secondary)">
              Loading databases...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayDatabases.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-(--color-text-muted) text-lg mb-2">
            No databases found
          </p>
          <p className="text-(--color-text-muted) text-sm">
            Try adjusting your search query
          </p>
        </div>
      )}

      {/* Database Table */}
      {displayDatabases.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-(--color-border)">
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)"></th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                  Portfolios
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                  Treaties
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                  Cedants
                </th>
              </tr>
            </thead>
            <tbody>
              {displayDatabases.map((db: Database, index: number) => (
                <tr
                  key={db.id}
                  className={`border-b border-(--color-border) hover:bg-(--color-secondary) transition-colors ${
                    index % 2 === 0
                      ? 'bg-(--color-surface)'
                      : 'bg-(--color-secondary)'
                  }`}
                >
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={(data.databases || []).some(
                        (database: Database) => database.id === db.id
                      )}
                      onChange={() => handleCheckboxChange(db)}
                      aria-label={`Select ${db.name}`}
                    />
                  </td>
                  <td className="py-3 px-4 text-(--color-text)">{db.name}</td>
                  <td className="py-3 px-4 text-(--color-text-secondary)">
                    {db.size}
                  </td>
                  <td className="py-3 px-4 text-(--color-text-secondary)">
                    {db.portfolios}
                  </td>
                  <td className="py-3 px-4 text-(--color-text-secondary)">
                    {db.treaties}
                  </td>
                  <td className="py-3 px-4 text-(--color-text-secondary)">
                    {db.cedants}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Validation Error */}
      {errors.databases && (
        <p className="text-(--color-error) text-sm mt-2">{errors.databases}</p>
      )}
    </div>
  );
};

export default DatabaseForm;
