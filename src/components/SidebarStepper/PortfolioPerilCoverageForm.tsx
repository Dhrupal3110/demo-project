// PortfolioPerilCoverageForm.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { usePortfolioPerilCoverageApi } from '../../hooks/usePortfolioPerilCoverageApi';

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
    if (value === 'partial') return 'bg-white bg-dotted';
    return 'bg-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading portfolio peril coverage...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">{error}</div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          5 – Set portfolio peril coverage
        </h2>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            How coverage states work:
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-white border border-gray-300 rounded"></div>
              <span>
                <strong>Empty (White):</strong> No coverage - Click to enable
                partial coverage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-dotted border border-gray-300 rounded"></div>
              <span>
                <strong>Dotted:</strong> Partial coverage - Click to enable full
                coverage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-(--color-primary-dark) border border-gray-300 rounded"></div>
              <span>
                <strong>Green:</strong> Full coverage - Click to remove coverage
              </span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-3 italic">
            💡 Tip: Use header checkboxes to select/deselect all rows for a
            specific peril, or use the "All" checkbox in each row to select all
            perils for that portfolio.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search database - portfolio name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={subPerils}
                onChange={(e) => setSubPerils(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--color-primary-light) rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
            </div>
            <span className="text-sm text-gray-700">Subperils</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700 min-w-[200px]">
                Database
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Portfolio
              </th>
              {perils.map((peril) => (
                <th
                  key={peril}
                  className="border border-gray-300 py-3 px-4 text-center font-semibold text-gray-700 w-16"
                >
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isHeaderChecked(peril)}
                      onChange={() => handleHeaderCheckbox(peril)}
                      className="w-4 h-4 text-(--color-primary) rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs">{peril}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: PortfolioPeril) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 py-3 px-4 text-gray-900">
                  {item.database}
                </td>
                <td className="border border-gray-300 py-3 px-4 text-gray-900">
                  {item.portfolio}
                </td>
                <td className="border border-gray-300 p-0 text-center">
                  <div className="flex items-center justify-center h-full py-3">
                    <input
                      type="checkbox"
                      checked={item.all}
                      onChange={() => handleAllCheckbox(item.id, 'All')}
                      className="w-4 h-4 text-(--color-primary) rounded border-gray-300 cursor-pointer"
                    />
                  </div>
                </td>
                {perils.slice(1).map((peril) => (
                  <td
                    key={peril}
                    className={`border border-gray-300 p-0 cursor-pointer relative ${getCellClass(item.coverages[peril])}`}
                    onClick={() => handleAllCheckbox(item.id, peril)}
                  >
                    <div className="h-16 flex items-center justify-center">
                      {item.coverages[peril] === true && (
                        <div className="text-white font-bold text-sm">
                          {peril} ▼
                        </div>
                      )}
                      {item.coverages[peril] === 'partial' && (
                        <div className="text-gray-700 font-bold text-sm">
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
        <p className="text-red-500 text-sm mt-2">
          {errors.portfolioPerilCoverage}
        </p>
      )}
    </div>
  );
};

export default PortfolioPerilCoverageForm;
