import React, { useState, useEffect } from 'react';
import { Search, Minus } from 'lucide-react';
import Checkbox from '../common/Checkbox';

interface Portfolio {
  id: string;
  name: string;
  checked: boolean;
}

interface Treaty {
  id: string;
  name: string;
  lob: string;
  cedant: string;
  checked: boolean;
}

interface LinkedItem {
  id: string;
  database: string;
  portfolio: string;
  treaty: string;
}

interface ValidationErrors {
  linkedItems?: string;
}

const LinkPortfoliosTreatiesForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [treatySearch, setTreatySearch] = useState('');
  // const [selectedDatabase, setSelectedDatabase] = useState('');

  const databases = [
    'EDM_RH_39823_AutoOwners_EQ_19',
    'RDM_RH_39823_AutoOwners_ALL_19',
  ];

  const initialPortfolios: Portfolio[] = [
    { id: '1', name: 'Port 1', checked: true },
    { id: '2', name: 'Port 7', checked: false },
  ];

  const initialTreaties: Treaty[] = [
    {
      id: '1',
      name: 'Treaty 1',
      lob: 'LOB 1',
      cedant: 'Cedant 1',
      checked: true,
    },
    {
      id: '2',
      name: 'Treaty 7',
      lob: 'LOB 2',
      cedant: 'Cedant 2',
      checked: false,
    },
  ];

  const initialLinkedItems: LinkedItem[] = [
    {
      id: '1',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolio: 'Port 1',
      treaty: 'Treaty 1',
    },
  ];

  // Get current values from data or use defaults
  const portfolios = data.portfolios || initialPortfolios;
  const treaties = data.treaties || initialTreaties;
  const linkedItems = data.linkedItems || initialLinkedItems;
  const currentDatabase = data.selectedDatabase || databases[0];

  // Initialize data if not present
  useEffect(() => {
    if (
      !data.portfolios ||
      !data.treaties ||
      !data.linkedItems ||
      !data.selectedDatabase
    ) {
      onChange({
        ...data,
        portfolios: data.portfolios || initialPortfolios,
        treaties: data.treaties || initialTreaties,
        linkedItems: data.linkedItems || initialLinkedItems,
        selectedDatabase: data.selectedDatabase || databases[0],
      });
    }
  }, []);

  // Set selectedDatabase from data
  // useEffect(() => {
  //   if (data.selectedDatabase) {
  //     setSelectedDatabase(data.selectedDatabase);
  //   } else {
  //     setSelectedDatabase(databases[0]);
  //   }
  // }, [data.selectedDatabase]);

  const filteredPortfolios = portfolios.filter((p: Portfolio) =>
    p.name.toLowerCase().includes(portfolioSearch.toLowerCase())
  );

  const filteredTreaties = treaties.filter((t: Treaty) =>
    t.name.toLowerCase().includes(treatySearch.toLowerCase())
  );

  const handlePortfolioCheck = (id: string) => {
    const updated = portfolios.map((p: Portfolio) =>
      p.id === id ? { ...p, checked: !p.checked } : p
    );
    onChange({ ...data, portfolios: updated });
  };

  const handleTreatyCheck = (id: string) => {
    const updated = treaties.map((t: Treaty) =>
      t.id === id ? { ...t, checked: !t.checked } : t
    );
    onChange({ ...data, treaties: updated });
  };

  const handlePortfolioHeaderCheck = (checked: boolean) => {
    const updated = portfolios.map((p: Portfolio) => ({ ...p, checked }));
    onChange({ ...data, portfolios: updated });
  };

  const handleTreatyHeaderCheck = (checked: boolean) => {
    const updated = treaties.map((t: Treaty) => ({ ...t, checked }));
    onChange({ ...data, treaties: updated });
  };

  const handleDatabaseChange = (db: string) => {
    // setSelectedDatabase(db);
    onChange({ ...data, selectedDatabase: db });
  };

  const handleAdd = () => {
    const checkedPortfolios = portfolios.filter((p: Portfolio) => p.checked);
    const checkedTreaties = treaties.filter((t: Treaty) => t.checked);

    const newLinks: LinkedItem[] = [];
    checkedPortfolios.forEach((portfolio: Portfolio) => {
      checkedTreaties.forEach((treaty: Treaty) => {
        // Check if link already exists
        const exists = linkedItems.some(
          (item: LinkedItem) =>
            item.database === currentDatabase &&
            item.portfolio === portfolio.name &&
            item.treaty === treaty.name
        );
        if (!exists) {
          newLinks.push({
            id: `${Date.now()}-${Math.random()}`,
            database: currentDatabase,
            portfolio: portfolio.name,
            treaty: treaty.name,
          });
        }
      });
    });

    if (newLinks.length > 0) {
      onChange({ ...data, linkedItems: [...linkedItems, ...newLinks] });
    }
  };

  const handleRemove = (id: string) => {
    const updated = linkedItems.filter((item: LinkedItem) => item.id !== id);
    onChange({ ...data, linkedItems: updated });
  };

  const allPortfoliosChecked =
    portfolios.length > 0 && portfolios.every((p: Portfolio) => p.checked);
  const somePortfoliosChecked = portfolios.some((p: Portfolio) => p.checked);

  const allTreatiesChecked =
    treaties.length > 0 && treaties.every((t: Treaty) => t.checked);
  const someTreatiesChecked = treaties.some((t: Treaty) => t.checked);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          10 – Link portfolios and treaties
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by portfolio name"
              value={portfolioSearch}
              onChange={(e) => setPortfolioSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by treaty name"
              value={treatySearch}
              onChange={(e) => setTreatySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-medium hover:bg-(--color-primary-dark) focus:outline-none focus:ring-2 focus:ring-(--color-primary) ml-auto"
          >
            Add
          </button>
        </div>
      </div>

      {/* Database Tabs and Lists */}
      <div className="mb-8">
        {/* Database Tabs */}
        <div className="flex gap-2 mb-6">
          {databases.map((db) => (
            <button
              key={db}
              onClick={() => handleDatabaseChange(db)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                currentDatabase === db
                  ? 'bg-white border-2 border-gray-300 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {db}
            </button>
          ))}
        </div>

        {/* Two Panel Lists */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Portfolios */}
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <div className="border-b border-gray-300">
              <div className="flex items-center px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    size="sm"
                    checked={allPortfoliosChecked}
                    indeterminate={
                      somePortfoliosChecked && !allPortfoliosChecked
                    }
                    onChange={(e) =>
                      handlePortfolioHeaderCheck(e.target.checked)
                    }
                    aria-label="Select all portfolios"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Portfolio name
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {filteredPortfolios.map((portfolio: Portfolio) => (
                  <div
                    key={portfolio.id}
                    className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      size="sm"
                      checked={portfolio.checked}
                      onChange={() => handlePortfolioCheck(portfolio.id)}
                      aria-label={`Select portfolio ${portfolio.name}`}
                    />
                    <span className="text-sm text-gray-700">
                      {portfolio.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Treaties */}
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <div className="border-b border-gray-300">
              <div className="flex items-center px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    size="sm"
                    checked={allTreatiesChecked}
                    indeterminate={
                      someTreatiesChecked && !allTreatiesChecked
                    }
                    onChange={(e) => handleTreatyHeaderCheck(e.target.checked)}
                    aria-label="Select all treaties"
                  />
                  <span className="text-sm font-semibold text-gray-900 flex-1">
                    Treaty name
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-24 text-center">
                  LOB
                </span>
                <span className="text-sm font-semibold text-gray-900 w-24 text-center">
                  Cedant
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {filteredTreaties.map((treaty: Treaty) => (
                  <div
                    key={treaty.id}
                    className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      size="sm"
                      checked={treaty.checked}
                      onChange={() => handleTreatyCheck(treaty.id)}
                      aria-label={`Select treaty ${treaty.name}`}
                    />
                    <span className="text-sm text-gray-700 flex-1">
                      {treaty.name}
                    </span>
                    <span className="text-sm text-gray-700 w-24 text-center">
                      {treaty.lob}
                    </span>
                    <span className="text-sm text-gray-700 w-24 text-center">
                      {treaty.cedant}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Items Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Database
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Portfolio
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Treaty
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {linkedItems.map((item: LinkedItem) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.database}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.portfolio}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.treaty}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-(--color-primary) text-white rounded-full hover:bg-(--color-primary-dark)"
                  >
                    <Minus size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {errors.linkedItems && (
        <p className="text-red-500 text-sm mt-2">{errors.linkedItems}</p>
      )}
    </div>
  );
};

export default LinkPortfoliosTreatiesForm;
