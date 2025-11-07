import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Analysis {
  id: string;
  databaseName: string;
  portfolioName: string;
  numTreaties: number;
  profile: string;
  currency: string;
  priority: string;
  expanded: boolean;
}

interface ValidationErrors {
  reviewAnalyses?: string;
}

const ReviewAnalyses: React.FC<{
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Initial data
  const initialAnalyses: Analysis[] = [
    {
      id: '1',
      databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolioName: 'Port1',
      numTreaties: 1,
      profile: 'A1 – US EQ',
      currency: 'USD',
      priority: 'Low',
      expanded: false,
    },
    {
      id: '2',
      databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolioName: 'Port7',
      numTreaties: 1,
      profile: 'A1 – US EQ',
      currency: 'USD',
      priority: 'Low',
      expanded: false,
    },
    {
      id: '3',
      databaseName: 'RDM_RH_39823_AutoOwners_ALL_19',
      portfolioName: 'Port20',
      numTreaties: 2,
      profile: 'A1 – US EQ',
      currency: 'USD',
      priority: 'Low',
      expanded: true,
    },
  ];

  const currentAnalyses = data.analyses || initialAnalyses;
  const currentContext = data.context || 'Treaty Pricing';

  // Initialize data if not present
  React.useEffect(() => {
    if (!data.analyses) {
      onChange({
        ...data,
        analyses: initialAnalyses,
        context: 'Treaty Pricing',
      });
    }
  }, []);

  const filteredAnalyses = currentAnalyses.filter(
    (analysis: Analysis) =>
      analysis.databaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.portfolioName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    const updated = currentAnalyses.map((analysis: Analysis) =>
      analysis.id === id
        ? { ...analysis, expanded: !analysis.expanded }
        : analysis
    );
    onChange({ ...data, analyses: updated });
  };

  const handleCurrencyChange = (id: string, value: string) => {
    const updated = currentAnalyses.map((analysis: Analysis) =>
      analysis.id === id ? { ...analysis, currency: value } : analysis
    );
    onChange({ ...data, analyses: updated });
  };

  const handlePriorityChange = (id: string, value: string) => {
    const updated = currentAnalyses.map((analysis: Analysis) =>
      analysis.id === id ? { ...analysis, priority: value } : analysis
    );
    onChange({ ...data, analyses: updated });
  };

  const handleContextChange = (value: string) => {
    onChange({ ...data, context: value });
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          11 – Review analyses
        </h1>

        <div className="mb-6">
          <div className="relative max-w-xs">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Database name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Portfolio name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Num of Treaties
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Profile
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Currency
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.map((analysis: Analysis) => (
                <tr
                  key={analysis.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    {analysis.databaseName}
                  </td>
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    {analysis.portfolioName}
                  </td>
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    <button
                      onClick={() => toggleExpand(analysis.id)}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      {analysis.expanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronUp size={16} />
                      )}
                      <span>{analysis.numTreaties}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    {analysis.profile}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={
                        currentAnalyses.find(
                          (a: Analysis) => a.id === analysis.id
                        )?.currency || 'USD'
                      }
                      onChange={(e) =>
                        handleCurrencyChange(analysis.id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={
                        currentAnalyses.find(
                          (a: Analysis) => a.id === analysis.id
                        )?.priority || 'Low'
                      }
                      onChange={(e) =>
                        handlePriorityChange(analysis.id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Context:</label>
          <select
            value={currentContext}
            onChange={(e) => handleContextChange(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="Treaty Pricing">Treaty Pricing</option>
            <option value="Portfolio Analysis">Portfolio Analysis</option>
            <option value="Risk Assessment">Risk Assessment</option>
          </select>
        </div>

        {errors.reviewAnalyses && (
          <p className="text-red-500 text-sm mt-2">{errors.reviewAnalyses}</p>
        )}
      </div>
    </div>
  );
};

export default ReviewAnalyses;
