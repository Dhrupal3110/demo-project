import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

import { useReviewAnalysesApi } from '@/features/sidebarStepper/hooks';
import type { Analysis } from '@/services/mockData/reviewAnalysesMockData';

interface ValidationErrors {
  reviewAnalyses?: string;
}

const ReviewAnalyses: React.FC<{
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  errors: ValidationErrors;
}> = ({ data, onChange, errors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [context, setContext] = useState('');

  const {
    reviewData,
    loading,
    error,
    updateAnalysisCurrency,
    updateAnalysisPriority,
    updateContext,
    toggleExpanded,
  } = useReviewAnalysesApi();

  useEffect(() => {
    if (reviewData) {
      setAnalyses(reviewData.analyses);
      setContext(reviewData.context);

      onChange({
        ...data,
        analyses: reviewData.analyses,
        context: reviewData.context,
      });
    }
  }, [reviewData]);

  const filteredAnalyses = analyses.filter(
    (analysis: Analysis) =>
      analysis.databaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.portfolioName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleExpand = async (id: string) => {
    try {
      await toggleExpanded(id);
      const updated = analyses.map((analysis: Analysis) =>
        analysis.id === id
          ? { ...analysis, expanded: !analysis.expanded }
          : analysis
      );
      setAnalyses(updated);
      onChange({ ...data, analyses: updated });
    } catch (err) {
      console.error('Failed to toggle expand:', err);
    }
  };

  const handleCurrencyChange = async (id: string, value: string) => {
    try {
      await updateAnalysisCurrency(id, value);
      const updated = analyses.map((analysis: Analysis) =>
        analysis.id === id ? { ...analysis, currency: value } : analysis
      );
      setAnalyses(updated);
      onChange({ ...data, analyses: updated });
    } catch (err) {
      console.error('Failed to update currency:', err);
    }
  };

  const handlePriorityChange = async (id: string, value: string) => {
    try {
      await updateAnalysisPriority(id, value);
      const updated = analyses.map((analysis: Analysis) =>
        analysis.id === id ? { ...analysis, priority: value } : analysis
      );
      setAnalyses(updated);
      onChange({ ...data, analyses: updated });
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleContextChange = async (value: string) => {
    try {
      await updateContext(value);
      setContext(value);
      onChange({ ...data, context: value });
    } catch (err) {
      console.error('Failed to update context:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-(--color-text-secondary)">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-(--color-error-bg) border border-(--color-error-border) rounded-lg p-4">
        <p className="text-(--color-error)">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-(--color-text) mb-6">
          11 – Review analyses
        </h1>

        <div className="mb-6">
          <div className="relative max-w-xs">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-muted)"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--color-border)">
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary) text-sm">
                  Database name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary) text-sm">
                  Portfolio name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary) text-sm">
                  Num of Treaties
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary) text-sm">
                  Profile
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary) text-sm">
                  Currency
                </th>
                <th className="text-left py-3 px-4 font-semibold text-(--color-text-secondary) text-sm">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.map((analysis: Analysis) => (
                <tr
                  key={analysis.id}
                  className="border-b border-(--color-border) hover:bg-(--color-secondary)"
                >
                  <td className="py-3 px-4 text-(--color-text) text-sm">
                    {analysis.databaseName}
                  </td>
                  <td className="py-3 px-4 text-(--color-text) text-sm">
                    {analysis.portfolioName}
                  </td>
                  <td className="py-3 px-4 text-(--color-text) text-sm">
                    <button
                      onClick={() => handleToggleExpand(analysis.id)}
                      className="flex items-center gap-1 hover:text-(--color-info)"
                    >
                      {analysis.expanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronUp size={16} />
                      )}
                      <span>{analysis.numTreaties}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-(--color-text) text-sm">
                    {analysis.profile}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={analysis.currency}
                      onChange={(e) =>
                        handleCurrencyChange(analysis.id, e.target.value)
                      }
                      className="border border-(--color-border) rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                    >
                      {reviewData?.currencyOptions.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={analysis.priority}
                      onChange={(e) =>
                        handlePriorityChange(analysis.id, e.target.value)
                      }
                      className="border border-(--color-border) rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                    >
                      {reviewData?.priorityOptions.map((pri) => (
                        <option key={pri} value={pri}>
                          {pri}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end items-center gap-3">
          <label className="text-sm font-medium text-(--color-text-secondary)">
            Context:
          </label>
          <select
            value={context}
            onChange={(e) => handleContextChange(e.target.value)}
            className="border border-(--color-border) rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) min-w-[200px]"
          >
            {reviewData?.contextOptions.map((ctx) => (
              <option key={ctx} value={ctx}>
                {ctx}
              </option>
            ))}
          </select>
        </div>

        {errors.reviewAnalyses && (
          <p className="text-(--color-error) text-sm mt-2">
            {errors.reviewAnalyses}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewAnalyses;
