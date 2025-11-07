import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Database {
  id: string;
  name: string;
  size: string;
  portfolios: number;
  treaties: number;
  cedants: number;
}

interface ValidationErrors {
  databases?: string;
}

const DatabaseForm: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const databases: Database[] = [
    {
      id: '1',
      name: 'EDM_RH_39823_AutoOwners_EQ_19',
      size: '93 MB',
      portfolios: 10,
      treaties: 3,
      cedants: 4,
    },
    {
      id: '2',
      name: 'ZH_116751_BPCS_HD_25_EDM',
      size: '43 MB',
      portfolios: 123,
      treaties: 46,
      cedants: 5,
    },
    {
      id: '3',
      name: 'ZH_117125_AXA_XL_Prop_HD_25_EDM',
      size: '891 MB',
      portfolios: 15,
      treaties: 1,
      cedants: 6,
    },
    {
      id: '4',
      name: 'RDM_RH_39823_AutoOwners_ALL_19',
      size: '1 GB',
      portfolios: 34,
      treaties: 2,
      cedants: 21,
    },
    {
      id: '5',
      name: 'ZH_117263_SVG_WS_CatXL_25_EDM',
      size: '3 GB',
      portfolios: 4,
      treaties: 0,
      cedants: 1,
    },
    {
      id: '6',
      name: 'ZH_118310_SV_Sachsen_WS_25_EDM',
      size: '3 GB',
      portfolios: 3,
      treaties: 345,
      cedants: 1,
    },
    {
      id: '7',
      name: 'ZH_117215_PZU_25_EDM',
      size: '2 GB',
      portfolios: 55,
      treaties: 4,
      cedants: 2,
    },
    {
      id: '8',
      name: 'ZH_117163_LF_HD_Broker_25_EDM',
      size: '1 GB',
      portfolios: 30,
      treaties: 33,
      cedants: 43,
    },
    {
      id: '9',
      name: 'RH_123049_AEGIS_QS_PPR_25_EDM',
      size: '119 MB',
      portfolios: 3,
      treaties: 83,
      cedants: 5,
    },
  ];

  const filteredDatabases = databases.filter((db) =>
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (database: Database) => {
    const current = data.databases || [];
    const isSelected = current.some((db: Database) => db.id === database.id);
    const updated = isSelected
      ? current.filter((db: Database) => db.id !== database.id)
      : [...current, database];
    onChange({ ...data, databases: updated });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2 - Select databases
        </h2>

        <div className="relative mb-4 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Database name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
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
                Size
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Portfolios
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Treaties
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Cedants
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDatabases.map((db, index) => (
              <tr
                key={db.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={(data.databases || []).some(
                      (database: Database) => database.id === db.id
                    )}
                    onChange={() => handleCheckboxChange(db)}
                    className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4 text-gray-900">{db.name}</td>
                <td className="py-3 px-4 text-gray-700">{db.size}</td>
                <td className="py-3 px-4 text-gray-700">{db.portfolios}</td>
                <td className="py-3 px-4 text-gray-700">{db.treaties}</td>
                <td className="py-3 px-4 text-gray-700">{db.cedants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.databases && (
        <p className="text-red-500 text-sm mt-2">{errors.databases}</p>
      )}
    </div>
  );
};

export default DatabaseForm;
