import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Treaty {
  id: string;
  name: string;
  num: string;
  date: string;
  limit: string;
  cedant: string;
  lob: string;
  databaseId: string;
}

interface Database {
  id: string;
  name: string;
  treaties: Treaty[];
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

  // Sample databases with treaties
  const databases: Database[] = [
    {
      id: '1',
      name: 'EDM_RH_39823_AutoOwners_EQ_19',
      treaties: [
        {
          id: 't1',
          name: 'Treaty 1',
          num: 'Treaty 1',
          date: '10 May 2025',
          limit: '5,000',
          cedant: 'Cedant 1',
          lob: 'Property',
          databaseId: '1',
        },
        {
          id: 't2',
          name: 'Treaty 2',
          num: 'Treaty 2',
          date: '10 May 2025',
          limit: '10,000',
          cedant: 'Cedant 2',
          lob: 'Marine',
          databaseId: '1',
        },
        {
          id: 't3',
          name: 'Treaty 4',
          num: 'Treaty 4',
          date: '10 May 2025',
          limit: '34,000,000',
          cedant: 'Cedant 4',
          lob: 'Property',
          databaseId: '1',
        },
        {
          id: 't4',
          name: 'Treaty 7',
          num: 'Treaty 7',
          date: '10 May 2025',
          limit: '4,000,000',
          cedant: 'Cedant 7',
          lob: 'Property',
          databaseId: '1',
        },
      ],
    },
    {
      id: '4',
      name: 'RDM_RH_39823_AutoOwners_ALL_19',
      treaties: [
        {
          id: 't5',
          name: 'Treaty A',
          num: 'Treaty A',
          date: '15 May 2025',
          limit: '2,500,000',
          cedant: 'Cedant A',
          lob: 'Casualty',
          databaseId: '4',
        },
        {
          id: 't6',
          name: 'Treaty B',
          num: 'Treaty B',
          date: '15 May 2025',
          limit: '8,000,000',
          cedant: 'Cedant B',
          lob: 'Property',
          databaseId: '4',
        },
      ],
    },
  ];

  // Initialize data if not present
  React.useEffect(() => {
    if (!data.treaties) {
      onChange({ ...data, treaties: [] });
    }
  }, []);

  const currentTreaties = data.treaties || [];
  const activeDatabase = databases.find((db) => db.id === activeTab);

  const filteredTreaties =
    activeDatabase?.treaties.filter((treaty) =>
      treaty.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleCheckboxChange = (treaty: Treaty) => {
    const isSelected = currentTreaties.some((t: Treaty) => t.id === treaty.id);
    const updated = isSelected
      ? currentTreaties.filter((t: Treaty) => t.id !== treaty.id)
      : [...currentTreaties, treaty];
    onChange({ ...data, treaties: updated });
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            7 – Select treaties
          </h2>
          {/* <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full text-sm font-medium hover:bg-emerald-50">
            Edit treaties
          </button> */}
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Database Tabs */}
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

      {/* Treaties Table */}
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
            {filteredTreaties.map((treaty, index) => (
              <tr
                key={treaty.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={currentTreaties.some(
                      (t: Treaty) => t.id === treaty.id
                    )}
                    onChange={() => handleCheckboxChange(treaty)}
                    className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
