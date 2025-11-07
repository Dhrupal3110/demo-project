export interface Analysis {
  id: string;
  databaseName: string;
  portfolioName: string;
  numTreaties: number;
  profile: string;
  currency: string;
  priority: string;
  expanded: boolean;
}

export interface ReviewAnalysesData {
  analyses: Analysis[];
  context: string;
  currencyOptions: string[];
  priorityOptions: string[];
  contextOptions: string[];
}

export const mockReviewAnalysesData: ReviewAnalysesData = {
  analyses: [
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
    {
      id: '4',
      databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolioName: 'Port3',
      numTreaties: 3,
      profile: 'A2 – US Property',
      currency: 'USD',
      priority: 'Medium',
      expanded: false,
    },
    {
      id: '5',
      databaseName: 'RDM_RH_39823_AutoOwners_ALL_19',
      portfolioName: 'Port15',
      numTreaties: 2,
      profile: 'A3 – International',
      currency: 'EUR',
      priority: 'High',
      expanded: false,
    },
    {
      id: '6',
      databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolioName: 'Port8',
      numTreaties: 4,
      profile: 'A1 – US EQ',
      currency: 'USD',
      priority: 'Medium',
      expanded: false,
    },
  ],
  context: 'Treaty Pricing',
  currencyOptions: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'],
  priorityOptions: ['Low', 'Medium', 'High', 'Critical'],
  contextOptions: [
    'Treaty Pricing',
    'Portfolio Analysis',
    'Risk Assessment',
    'Capital Modeling',
    'Reinsurance Strategy',
  ],
};