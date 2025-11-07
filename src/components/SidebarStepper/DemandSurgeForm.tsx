import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface DemandSurgeItem {
  id: string;
  databaseName: string;
  portfolioName: string;
  demandSurge: boolean;
  justification: string;
}

interface ValidationErrors {
  demandSurge?: string;
}

const DemandSurgeForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [databaseSearch, setDatabaseSearch] = useState('');
  const [portfolioSearch, setPortfolioSearch] = useState('');

  // Sample data based on selected portfolios
  const demandSurgeItems: DemandSurgeItem[] = [
    {
      id: '1',
      databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolioName: 'Port 1',
      demandSurge: true,
      justification: '',
    },
    {
      id: '2',
      databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolioName: 'Port 7',
      demandSurge: true,
      justification: '',
    },
    {
      id: '3',
      databaseName: 'RDM_RH_39823_AutoOwners_ALL_19',
      portfolioName: 'Port 20',
      demandSurge: false,
      justification: 'Auto portfolio as per submission',
    },
  ];

  const currentItems = data.demandSurgeItems || demandSurgeItems;

  const filteredItems = currentItems.filter(
    (item: DemandSurgeItem) =>
      item.databaseName.toLowerCase().includes(databaseSearch.toLowerCase()) &&
      item.portfolioName.toLowerCase().includes(portfolioSearch.toLowerCase())
  );

  // Initialize data if not present
  React.useEffect(() => {
    if (!data.demandSurgeItems) {
      onChange({ ...data, demandSurgeItems: demandSurgeItems });
    }
  }, []);

  const handleToggleChange = (itemId: string, value: boolean) => {
    const updated = currentItems.map((item: DemandSurgeItem) =>
      item.id === itemId ? { ...item, demandSurge: value } : item
    );
    onChange({ ...data, demandSurgeItems: updated });
  };

  const handleJustificationChange = (itemId: string, value: string) => {
    const updated = currentItems.map((item: DemandSurgeItem) =>
      item.id === itemId ? { ...item, justification: value } : item
    );
    onChange({ ...data, demandSurgeItems: updated });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          4 – Set demand surge
        </h2>

        {/* Search Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by database name"
              value={databaseSearch}
              onChange={(e) => setDatabaseSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by portfolio name"
              value={portfolioSearch}
              onChange={(e) => setPortfolioSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Demand Surge Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Database name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Portfolio name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Demand surge
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Justification
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: any, index: number) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-4 text-gray-900">{item.databaseName}</td>
                <td className="py-3 px-4 text-gray-900">
                  {item.portfolioName}
                </td>
                <td className="py-3 px-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        currentItems.find(
                          (i: DemandSurgeItem) => i.id === item.id
                        )?.demandSurge || false
                      }
                      onChange={(e) =>
                        handleToggleChange(item.id, e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={
                      currentItems.find(
                        (i: DemandSurgeItem) => i.id === item.id
                      )?.justification || ''
                    }
                    onChange={(e) =>
                      handleJustificationChange(item.id, e.target.value)
                    }
                    placeholder=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.demandSurge && (
        <p className="text-red-500 text-sm mt-2">{errors.demandSurge}</p>
      )}
    </div>
  );
};

export default DemandSurgeForm;
