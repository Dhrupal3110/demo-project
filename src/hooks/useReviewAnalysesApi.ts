import { useState, useEffect } from 'react';
import type { ReviewAnalysesData } from '../api/mockData/reviewAnalysesMockData';
import { mockReviewAnalysesService } from '../api/mocks/mockReviewAnalysesService';

export const useReviewAnalysesApi = () => {
  const [reviewData, setReviewData] = useState<ReviewAnalysesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await mockReviewAnalysesService.fetchReviewAnalysesData();
      setReviewData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load review analyses data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAnalysisCurrency = async (id: string, currency: string): Promise<void> => {
    try {
      const updated = await mockReviewAnalysesService.updateAnalysis(id, { currency });
      if (reviewData) {
        setReviewData({
          ...reviewData,
          analyses: reviewData.analyses.map(a => a.id === id ? updated : a),
        });
      }
    } catch (err) {
      setError('Failed to update currency');
      console.error(err);
      throw err;
    }
  };

  const updateAnalysisPriority = async (id: string, priority: string): Promise<void> => {
    try {
      const updated = await mockReviewAnalysesService.updateAnalysis(id, { priority });
      if (reviewData) {
        setReviewData({
          ...reviewData,
          analyses: reviewData.analyses.map(a => a.id === id ? updated : a),
        });
      }
    } catch (err) {
      setError('Failed to update priority');
      console.error(err);
      throw err;
    }
  };

  const updateContext = async (context: string): Promise<void> => {
    try {
      await mockReviewAnalysesService.updateContext(context);
      if (reviewData) {
        setReviewData({
          ...reviewData,
          context,
        });
      }
    } catch (err) {
      setError('Failed to update context');
      console.error(err);
      throw err;
    }
  };

  const toggleExpanded = async (id: string): Promise<void> => {
    try {
      const updated = await mockReviewAnalysesService.toggleExpanded(id);
      if (reviewData) {
        setReviewData({
          ...reviewData,
          analyses: reviewData.analyses.map(a => a.id === id ? updated : a),
        });
      }
    } catch (err) {
      setError('Failed to toggle expanded state');
      console.error(err);
      throw err;
    }
  };

  return {
    reviewData,
    loading,
    error,
    updateAnalysisCurrency,
    updateAnalysisPriority,
    updateContext,
    toggleExpanded,
  };
};