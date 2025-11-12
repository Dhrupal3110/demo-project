// PortfolioPerilCoverageForm.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { Checkbox } from '@/components/common';
import { usePortfolioPerilCoverageApi } from '@/features/sidebarStepper/hooks';

interface PerilCoverage {
  [key: string]: boolean | 'partial';
}

interface PortfolioPeril {
  id: string;
  database: string;
  portfolio: string;
  all: boolean;
  coverages: PerilCoverage;
}

interface ValidationErrors {
  portfolioPerilCoverage?: string;
}

const PortfolioPerilCoverageForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subPerils, setSubPerils] = useState(false);
  const { items, loading, error } = usePortfolioPerilCoverageApi();

  const perils = ['All', 'EQ', 'WS', 'CS', 'FL', 'WF', 'TR', 'WC'];

  useEffect(() => {
    if (!data.portfolioPerils && items.length > 0) {
      onChange({ ...data, portfolioPerils: items });
    }
  }, [items]);

  const currentData = data.portfolioPerils || items;

  const filteredData = currentData.filter(
    (item: PortfolioPeril) =>
      item.database.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.portfolio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHeaderCheckbox = (peril: string) => {
    const allChecked = currentData.every((item: PortfolioPeril) =>
      peril === 'All' ? item.all : item.coverages[peril] === true
    );

    const updated = currentData.map((item: PortfolioPeril) => {
      if (peril === 'All') {
        const newAllState = !allChecked;
        const newCoverages: PerilCoverage = {};
        perils.slice(1).forEach((p) => {
          newCoverages[p] = newAllState;
        });
        return { ...item, all: newAllState, coverages: newCoverages };
      } else {
        return {
          ...item,
          coverages: { ...item.coverages, [peril]: !allChecked },
        };
      }
    });
    onChange({ ...data, portfolioPerils: updated });
  };

  const handleAllCheckbox = (itemId: string, peril: string) => {
    const updated = currentData.map((item: PortfolioPeril) => {
      if (item.id === itemId) {
        if (peril === 'All') {
          const newAllState = !item.all;
          const newCoverages: PerilCoverage = {};
          perils.slice(1).forEach((p) => {
            newCoverages[p] = newAllState;
          });
          return { ...item, all: newAllState, coverages: newCoverages };
        } else {
          const currentValue = item.coverages[peril];
          let newValue: boolean | 'partial';
          if (currentValue === true) newValue = false;
          else if (currentValue === 'partial') newValue = true;
          else newValue = 'partial';

          return {
            ...item,
            coverages: { ...item.coverages, [peril]: newValue },
          };
        }
      }
      return item;
    });
    onChange({ ...data, portfolioPerils: updated });
  };

  const isHeaderChecked = (peril: string) => {
    return currentData.every((item: PortfolioPeril) =>
      peril === 'All' ? item.all : item.coverages[peril] === true
    );
  };

  const getCellClass = (value: boolean | 'partial') => {
    if (value === true) return 'bg-(--color-primary-dark)';
    if (value === 'partial') return 'bg-(--color-surface) bg-dotted';
    return 'bg-(--color-surface)';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-(--color-text-secondary)">
          Loading portfolio peril coverage...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-(--color-error)">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .bg-dotted {
          background-image: radial-gradient(circle, #000 1px, transparent 1px);
          background-size: 4px 4px;
          background-position: 0 0, 2px 2px;
        }
      `}</style>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-(--color-text) mb-6">
          5 – Set portfolio peril coverage
        </h2>

        <div className="mb-6 p-4 bg-(--color-info-bg) border border-(--color-info-border) rounded-lg">
          <h3 className="text-sm font-semibold text-(--color-info-dark) mb-2">
            How coverage states work:
          </h3>
          <div className="space-y-2 text-sm text-(--color-info-dark)">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-(--color-surface) border border-(--color-border) rounded"></div>
              <span>
                <strong>Empty (White):</strong> No coverage - Click to enable
                partial coverage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-dotted border border-(--color-border) rounded"></div>
              <span>
                <strong>Dotted:</strong> Partial coverage - Click to enable full
                coverage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-(--color-primary-dark) border border-(--color-border) rounded"></div>
              <span>
                <strong>Filled:</strong> Full coverage - Click to remove
                coverage
              </span>
            </div>
          </div>
          <p className="text-xs text-(--color-info-dark) mt-3 italic">
            💡 Tip: Use header checkboxes to select/deselect all rows for a
            specific peril, or use the "All" checkbox in each row to select all
            perils for that portfolio.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
              size={18}
            />
            <input
              type="text"
              placeholder="Search database - portfolio name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          <Checkbox
            variant="toggle"
            checked={subPerils}
            onChange={(e) => setSubPerils(e.target.checked)}
            label="Subperils"
            labelClassName="text-sm text-(--color-text-secondary)"
            aria-label="Toggle subperils"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-(--color-border)">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-(--color-hover)">
              <th className="border border-(--color-border) py-3 px-4 text-left font-semibold text-(--color-text-secondary) min-w-[200px]">
                Database
              </th>
              <th className="border border-(--color-border) py-3 px-4 text-left font-semibold text-(--color-text-secondary)">
                Portfolio
              </th>
              {perils.map((peril) => (
                <th
                  key={peril}
                  className="border border-(--color-border) py-3 px-4 text-center font-semibold text-(--color-text-secondary) w-16"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Checkbox
                      size="sm"
                      checked={isHeaderChecked(peril)}
                      onChange={() => handleHeaderCheckbox(peril)}
                      aria-label={`Toggle ${peril} coverage column`}
                    />
                    <span className="text-xs">{peril}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: PortfolioPeril) => (
              <tr key={item.id} className="hover:bg-(--color-secondary)">
                <td className="border border-(--color-border) py-3 px-4 text-(--color-text)">
                  {item.database}
                </td>
                <td className="border border-(--color-border) py-3 px-4 text-(--color-text)">
                  {item.portfolio}
                </td>
                <td className="border border-(--color-border) p-0 text-center">
                  <div className="flex items-center justify-center h-full py-3">
                    <Checkbox
                      size="sm"
                      checked={item.all}
                      onChange={() => handleAllCheckbox(item.id, 'All')}
                      aria-label={`Toggle all coverages for ${item.portfolio}`}
                    />
                  </div>
                </td>
                {perils.slice(1).map((peril) => (
                  <td
                    key={peril}
                    className={`border border-(--color-border) p-0 cursor-pointer relative ${getCellClass(item.coverages[peril])}`}
                    onClick={() => handleAllCheckbox(item.id, peril)}
                  >
                    <div className="h-16 flex items-center justify-center">
                      {item.coverages[peril] === true && (
                        <div className="text-(--color-primary-text) font-bold text-sm">
                          {peril} ▼
                        </div>
                      )}
                      {item.coverages[peril] === 'partial' && (
                        <div className="text-(--color-text-secondary) font-bold text-sm">
                          {peril} ▼
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.portfolioPerilCoverage && (
        <p className="text-(--color-error) text-sm mt-2">
          {errors.portfolioPerilCoverage}
        </p>
      )}
    </div>
  );
};

export default PortfolioPerilCoverageForm;
