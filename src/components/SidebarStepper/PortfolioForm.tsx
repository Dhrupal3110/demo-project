// PortfolioForm.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { usePortfolioApi } from '../../hooks/usePortfolioApi';

interface Portfolio {
  id: string;
  portfolioName: string;
  portfolioNumber: string;
  date: string;
  numberOfAccounts: number;
}

interface ValidationErrors {
  portfolios?: string;
}

const PortfolioForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const { databases, loading, error } = usePortfolioApi();

  const activeDatabase = databases.find((db) => db.id === activeTab);

  const filteredPortfolios = (
    (activeDatabase?.portfolios || []) as Portfolio[]
  ).filter((portfolio: Portfolio) =>
    portfolio.portfolioName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (portfolio: Portfolio) => {
    const current = data.portfolios || [];
    const isSelected = current.some((p: Portfolio) => p.id === portfolio.id);
    const updated = isSelected
      ? current.filter((p: Portfolio) => p.id !== portfolio.id)
      : [...current, portfolio];
    onChange({ ...data, portfolios: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading portfolios...</div>
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          3 - Select portfolios
        </h2>

        <div className="relative mb-4 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Portfolio name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 mb-4">
          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => setActiveTab(db.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === db.id
                  ? 'bg-white border-2 border-gray-300 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {db.name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Portfolio Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Portfolio Number
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Number of accounts
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPortfolios.map((portfolio: Portfolio, index: number) => (
              <tr
                key={portfolio.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={(data.portfolios || []).some(
                      (p: Portfolio) => p.id === portfolio.id
                    )}
                    onChange={() => handleCheckboxChange(portfolio)}
                    className="w-5 h-5 text-(--color-primary) rounded border-gray-300 focus:ring-2 focus:ring-(--color-primary) cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {portfolio.portfolioName}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {portfolio.portfolioNumber}
                </td>
                <td className="py-3 px-4 text-gray-700">{portfolio.date}</td>
                <td className="py-3 px-4 text-gray-700">
                  {portfolio.numberOfAccounts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.portfolios && (
        <p className="text-red-500 text-sm mt-2">{errors.portfolios}</p>
      )}
    </div>
  );
};

export default PortfolioForm;
