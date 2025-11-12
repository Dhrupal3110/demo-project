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
        <div className="text-gray-600">Loading treaties...</div>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            7 – Select treaties
          </h2>
        </div>

        <div className="relative mb-4 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Treaty name"
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
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Num
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Limit
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Cedant
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                LOB
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTreaties.map((treaty: Treaty, index: number) => (
              <tr
                key={treaty.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
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
                <td className="py-3 px-4 text-gray-900">{treaty.name}</td>
                <td className="py-3 px-4 text-gray-700">{treaty.num}</td>
                <td className="py-3 px-4 text-gray-700">{treaty.date}</td>
                <td className="py-3 px-4 text-gray-700">{treaty.limit}</td>
                <td className="py-3 px-4 text-gray-700">{treaty.cedant}</td>
                <td className="py-3 px-4 text-gray-700">{treaty.lob}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.treaties && (
        <p className="text-red-500 text-sm mt-2">{errors.treaties}</p>
      )}
    </div>
  );
};

export default TreatiesForm;
