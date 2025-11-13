// PortfolioForm.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

import { Checkbox, SectionTitle } from '@/components/common';
import { usePortfolioApi } from '@/features/sidebarStepper/hooks';

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

interface FormData {
  portfolios?: Portfolio[];
}

const PortfolioForm: React.FC<{
  data: FormData;
  onChange: (data: FormData) => void;
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
        <div className="text-(--color-text-secondary)">
          Loading portfolios...
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
      <div className="mb-6">
        <SectionTitle title="3 - Select portfolios" />

        <div className="relative mb-4 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Portfolio name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 mb-4">
          {databases.map((db) => (
            <button
              key={db.id}
              onClick={() => setActiveTab(db.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === db.id
                  ? 'bg-(--color-surface) border-2 border-(--color-border) text-(--color-text)'
                  : 'bg-(--color-hover) text-(--color-text-secondary) hover:bg-(--color-surface-muted)'
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
            <tr className="border-b-2 border-(--color-border)">
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)"></th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Portfolio Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Portfolio Number
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Number of accounts
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPortfolios.map((portfolio: Portfolio, index: number) => (
              <tr
                key={portfolio.id}
                className={`border-b border-(--color-border) hover:bg-(--color-secondary) ${index % 2 === 0 ? 'bg-(--color-surface)' : 'bg-(--color-secondary)'}`}
              >
                <td className="py-3 px-4">
                  <Checkbox
                    checked={(data.portfolios || []).some(
                      (p: Portfolio) => p.id === portfolio.id
                    )}
                    onChange={() => handleCheckboxChange(portfolio)}
                    aria-label={`Select portfolio ${portfolio.portfolioName}`}
                  />
                </td>
                <td className="py-3 px-4 text-(--color-text)">
                  {portfolio.portfolioName}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {portfolio.portfolioNumber}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {portfolio.date}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {portfolio.numberOfAccounts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.portfolios && (
        <p className="text-(--color-error) text-sm mt-2">{errors.portfolios}</p>
      )}
    </div>
  );
};

export default PortfolioForm;
