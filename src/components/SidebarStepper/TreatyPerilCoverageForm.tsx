// TreatyPerilCoverageForm.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTreatyPerilCoverageApi } from '../../hooks/useTreatyPerilCoverageApi';
import { perils } from '../../api/mockData/treatyPerilCoverageMockData';

interface PerilCoverage {
  [key: string]: boolean;
}

interface TreatyPeril {
  id: string;
  database: string;
  treaty: string;
  all: boolean;
  coverages: PerilCoverage;
}

interface ValidationErrors {
  treatyPerilCoverage?: string;
}

const TreatyPerilCoverageForm: React.FC<{
  data?: Record<string, any>;
  onChange?: (data: Record<string, any>) => void;
  errors?: ValidationErrors;
}> = ({ data = {}, onChange = () => {}, errors = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { treatyPerils, loading, error } = useTreatyPerilCoverageApi();

  React.useEffect(() => {
    if (!data.treatyPerils && treatyPerils.length > 0) {
      onChange({ ...data, treatyPerils });
    }
  }, [treatyPerils]);

  const currentData = data.treatyPerils || treatyPerils;

  const filteredData = currentData.filter(
    (item: TreatyPeril) =>
      item.database.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.treaty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHeaderCheckbox = (peril: string) => {
    const allChecked = currentData.every((item: TreatyPeril) =>
      peril === 'All' ? item.all : item.coverages[peril] === true
    );

    const updated = currentData.map((item: TreatyPeril) => {
      if (peril === 'All') {
        const newAllState = !allChecked;
        const newCoverages: PerilCoverage = {};
        perils.slice(1).forEach((p) => {
          newCoverages[p] = newAllState;
        });
        return { ...item, all: newAllState, coverages: newCoverages };
      } else {
        const newValue = !allChecked;
        const updatedCoverages = { ...item.coverages, [peril]: newValue };
        const allPerilsChecked = perils
          .slice(1)
          .every((p) => updatedCoverages[p]);
        return {
          ...item,
          coverages: updatedCoverages,
          all: allPerilsChecked,
        };
      }
    });
    onChange({ ...data, treatyPerils: updated });
  };

  const handleCellClick = (itemId: string, peril: string) => {
    const updated = currentData.map((item: TreatyPeril) => {
      if (item.id === itemId) {
        if (peril === 'All') {
          const newAllState = !item.all;
          const newCoverages: PerilCoverage = {};
          perils.slice(1).forEach((p) => {
            newCoverages[p] = newAllState;
          });
          return { ...item, all: newAllState, coverages: newCoverages };
        } else {
          const updatedCoverages = {
            ...item.coverages,
            [peril]: !item.coverages[peril],
          };
          const allPerilsChecked = perils
            .slice(1)
            .every((p) => updatedCoverages[p]);
          return {
            ...item,
            coverages: updatedCoverages,
            all: allPerilsChecked,
          };
        }
      }
      return item;
    });
    onChange({ ...data, treatyPerils: updated });
  };

  const isHeaderChecked = (peril: string) => {
    if (currentData.length === 0) return false;
    return currentData.every((item: TreatyPeril) =>
      peril === 'All' ? item.all : item.coverages[peril] === true
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading treaty peril coverage...</div>
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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          8 – Set treaty peril coverage
        </h2>

        <div className="mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search database - treaty name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700 min-w-60">
                Database
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700 min-w-[120px]">
                Treaty
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
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs">{peril}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: TreatyPeril) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 py-3 px-4 text-sm text-gray-700">
                  {item.database}
                </td>
                <td className="border border-gray-300 py-3 px-4 text-sm text-gray-700">
                  {item.treaty}
                </td>
                <td className="border border-gray-300 p-0 text-center">
                  <div className="flex items-center justify-center h-full py-3">
                    <input
                      type="checkbox"
                      checked={item.all}
                      onChange={() => handleCellClick(item.id, 'All')}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 cursor-pointer"
                    />
                  </div>
                </td>
                {perils.slice(1).map((peril) => (
                  <td
                    key={peril}
                    className={`border border-gray-300 p-0 cursor-pointer ${
                      item.coverages[peril] ? 'bg-emerald-700' : 'bg-white'
                    }`}
                    onClick={() => handleCellClick(item.id, peril)}
                  >
                    <div className="h-16 flex items-center justify-center">
                      {/* Empty cell, click to toggle */}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.treatyPerilCoverage && (
        <p className="text-red-500 text-sm mt-2">
          {errors.treatyPerilCoverage}
        </p>
      )}
    </div>
  );
};

export default TreatyPerilCoverageForm;
