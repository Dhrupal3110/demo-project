import { mockReviewAnalysesData, type ReviewAnalysesData, type Analysis } from '../mockData/reviewAnalysesMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockReviewAnalysesService {
  private data: ReviewAnalysesData = JSON.parse(JSON.stringify(mockReviewAnalysesData));

  async fetchReviewAnalysesData(): Promise<ReviewAnalysesData> {
    await delay(500);
    return JSON.parse(JSON.stringify(this.data));
  }

  async updateAnalysis(id: string, updates: Partial<Analysis>): Promise<Analysis> {
    await delay(300);
    const analysisIndex = this.data.analyses.findIndex(a => a.id === id);
    if (analysisIndex !== -1) {
      this.data.analyses[analysisIndex] = {
        ...this.data.analyses[analysisIndex],
        ...updates,
      };
      return this.data.analyses[analysisIndex];
    }
    throw new Error('Analysis not found');
  }

  async updateContext(context: string): Promise<string> {
    await delay(200);
    this.data.context = context;
    return context;
  }

  async toggleExpanded(id: string): Promise<Analysis> {
    await delay(200);
    const analysisIndex = this.data.analyses.findIndex(a => a.id === id);
    if (analysisIndex !== -1) {
      this.data.analyses[analysisIndex].expanded = !this.data.analyses[analysisIndex].expanded;
      return this.data.analyses[analysisIndex];
    }
    throw new Error('Analysis not found');
  }
}

export const mockReviewAnalysesService = new MockReviewAnalysesService();