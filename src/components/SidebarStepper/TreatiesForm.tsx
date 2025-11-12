// TreatiesForm.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTreatiesApi } from '../../hooks/useTreatiesApi';
import Checkbox from '../common/Checkbox';

interface Treaty {
  id: string | number;
  name: string;
  num: string | number;
  date: string;
  limit: string | number;
  cedant: string;
  lob: string;
}
interface ValidationErrors {
  treaties?: string;
}

const TreatiesForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const { databases, loading, error } = useTreatiesApi();

  React.useEffect(() => {
    if (!data.treaties) {
      onChange({ ...data, treaties: [] });
    }
  }, []);

  const currentTreaties = data.treaties || [];
  const activeDatabase = databases.find((db) => db.id === activeTab);

  const filteredTreaties: Treaty[] =
    (activeDatabase?.treaties as Treaty[] | undefined)?.filter((treaty) =>
      treaty.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const handleCheckboxChange = (treaty: Treaty) => {
    const isSelected = currentTreaties.some((t: Treaty) => t.id === treaty.id);
    const updated = isSelected
      ? currentTreaties.filter((t: Treaty) => t.id !== treaty.id)
      : [...currentTreaties, treaty];
    onChange({ ...data, treaties: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-(--color-text-secondary)">Loading treaties...</div>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-(--color-text)">
            7 – Select treaties
          </h2>
        </div>

        <div className="relative mb-4 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Treaty name"
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
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Num
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Limit
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                Cedant
              </th>
              <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary)">
                LOB
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTreaties.map((treaty: Treaty, index: number) => (
              <tr
                key={treaty.id}
                className={`border-b border-(--color-border) hover:bg-(--color-secondary) ${index % 2 === 0 ? 'bg-(--color-surface)' : 'bg-(--color-secondary)'}`}
              >
                <td className="py-3 px-4">
                  <Checkbox
                    checked={currentTreaties.some(
                      (t: Treaty) => t.id === treaty.id
                    )}
                    onChange={() => handleCheckboxChange(treaty)}
                    aria-label={`Select treaty ${treaty.name}`}
                  />
                </td>
                <td className="py-3 px-4 text-(--color-text)">{treaty.name}</td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {treaty.num}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {treaty.date}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {treaty.limit}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {treaty.cedant}
                </td>
                <td className="py-3 px-4 text-(--color-text-secondary)">
                  {treaty.lob}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.treaties && (
        <p className="text-(--color-error) text-sm mt-2">{errors.treaties}</p>
      )}
    </div>
  );
};

export default TreatiesForm;
