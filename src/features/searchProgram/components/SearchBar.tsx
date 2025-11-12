import React from 'react';
import { X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-(--color-text) mb-4">
        Enter a Program ID, Subscribe Reference, Arrow ID or Program name
      </h2>

      <div className="relative">
        <input
          type="text"
          placeholder="e.g. 107311 or AUTO OWNERS"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-3 pr-32 border border-(--color-border) rounded-full focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text-secondary) shadow-xl placeholder:font-semibold placeholder:text-(--color-border)"
        />

        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-32 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-secondary)"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-(--color-primary) hover:bg-(--color-primary-dark) text-(--color-primary-text) px-6 py-2 rounded-full transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
