import { mockLinkData,type LinkData, type LinkedItem } from '../mockData/linkPortfoliosTreatiesMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockLinkPortfoliosTreatiesService {
  private data: LinkData = JSON.parse(JSON.stringify(mockLinkData));

  async fetchLinkData(): Promise<LinkData> {
    await delay(500);
    return JSON.parse(JSON.stringify(this.data));
  }

  async addLinkedItems(items: LinkedItem[]): Promise<LinkedItem[]> {
    await delay(300);
    const newItems = items.map(item => ({
      ...item,
      id: `${Date.now()}-${Math.random()}`,
    }));
    this.data.linkedItems = [...this.data.linkedItems, ...newItems];
    return newItems;
  }

  async removeLinkedItem(id: string): Promise<void> {
    await delay(300);
    this.data.linkedItems = this.data.linkedItems.filter(item => item.id !== id);
  }

  async updateLinkedItems(items: LinkedItem[]): Promise<LinkedItem[]> {
    await delay(300);
    this.data.linkedItems = items;
    return items;
  }
}

export const mockLinkService = new MockLinkPortfoliosTreatiesService();