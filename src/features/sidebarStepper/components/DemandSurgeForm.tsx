// DemandSurgeForm.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { Checkbox, SectionTitle } from '@/components/common';
import { useDemandSurgeApi } from '@/features/sidebarStepper/hooks';

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
  const { items, loading, error } = useDemandSurgeApi();

  const currentItems = data.demandSurgeItems || items;

  const filteredItems = currentItems.filter(
    (item: DemandSurgeItem) =>
      item.databaseName.toLowerCase().includes(databaseSearch.toLowerCase()) &&
      item.portfolioName.toLowerCase().includes(portfolioSearch.toLowerCase())
  );

  useEffect(() => {
    if (!data.demandSurgeItems && items.length > 0) {
      onChange({ ...data, demandSurgeItems: items });
    }
  }, [items]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-(--color-text-secondary)">
          Loading demand surge items...
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
        <SectionTitle title="4 – Set demand surge" />

        <div className="flex gap-4 mb-6">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by database name"
              value={databaseSearch}
              onChange={(e) => setDatabaseSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by portfolio name"
              value={portfolioSearch}
              onChange={(e) => setPortfolioSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-(--color-border)">
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Database name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Portfolio name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Demand surge
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Justification
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: any, index: number) => (
              <tr
                key={item.id}
                className={`border-b border-(--color-border) ${index % 2 === 0 ? 'bg-(--color-surface)' : 'bg-(--color-secondary)'}`}
              >
                <td className="py-3 px-4 text-(--color-text)">
                  {item.databaseName}
                </td>
                <td className="py-3 px-4 text-(--color-text)">
                  {item.portfolioName}
                </td>
                <td className="py-3 px-4">
                  <Checkbox
                    variant="toggle"
                    checked={
                      currentItems.find(
                        (i: DemandSurgeItem) => i.id === item.id
                      )?.demandSurge || false
                    }
                    onChange={(e) =>
                      handleToggleChange(item.id, e.target.checked)
                    }
                    aria-label={`Toggle demand surge for ${item.portfolioName}`}
                  />
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
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.demandSurge && (
        <p className="text-(--color-error) text-sm mt-2">
          {errors.demandSurge}
        </p>
      )}
    </div>
  );
};

export default DemandSurgeForm;
