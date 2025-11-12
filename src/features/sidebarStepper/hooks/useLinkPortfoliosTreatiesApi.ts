import { useState, useEffect } from 'react';

import { mockLinkService } from '@/services/mocks/mockLinkPortfoliosTreatiesService';
import type {
  LinkData,
  LinkedItem,
  Portfolio,
  Treaty,
} from '@/services/mockData/linkPortfoliosTreatiesMockData';

export const useLinkPortfoliosTreatiesApi = () => {
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await mockLinkService.fetchLinkData();
      setLinkData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addLinkedItems = async (
    database: string,
    portfolios: Portfolio[],
    treaties: Treaty[]
  ): Promise<LinkedItem[]> => {
    try {
      const newLinks: LinkedItem[] = [];
      portfolios.forEach((portfolio) => {
        treaties.forEach((treaty) => {
          const exists = linkData?.linkedItems.some(
            (item) =>
              item.database === database &&
              item.portfolio === portfolio.name &&
              item.treaty === treaty.name
          );
          if (!exists) {
            newLinks.push({
              id: '',
              database,
              portfolio: portfolio.name,
              treaty: treaty.name,
            });
          }
        });
      });

      if (newLinks.length > 0) {
        const addedItems = await mockLinkService.addLinkedItems(newLinks);
        if (linkData) {
          setLinkData({
            ...linkData,
            linkedItems: [...linkData.linkedItems, ...addedItems],
          });
        }
        return addedItems;
      }
      return [];
    } catch (err) {
      setError('Failed to add linked items');
      console.error(err);
      throw err;
    }
  };

  const removeLinkedItem = async (id: string): Promise<void> => {
    try {
      await mockLinkService.removeLinkedItem(id);
      if (linkData) {
        setLinkData({
          ...linkData,
          linkedItems: linkData.linkedItems.filter((item) => item.id !== id),
        });
      }
    } catch (err) {
      setError('Failed to remove linked item');
      console.error(err);
      throw err;
    }
  };

  return {
    linkData,
    loading,
    error,
    addLinkedItems,
    removeLinkedItem,
  };
};