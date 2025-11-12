// portfolioMockData.ts
export interface Portfolio {
  id: string;
  portfolioName: string;
  portfolioNumber: string;
  date: string;
  numberOfAccounts: number;
}

export interface Database {
  id: string;
  name: string;
  portfolios: Portfolio[];
}

export const mockDatabases: Database[] = [
  {
    id: '1',
    name: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolios: [
      {
        id: 'p1',
        portfolioName: 'Port 1',
        portfolioNumber: 'Port 1',
        date: '10 May 2025',
        numberOfAccounts: 5,
      },
      {
        id: 'p2',
        portfolioName: 'Port 2',
        portfolioNumber: 'Port 2',
        date: '10 May 2025',
        numberOfAccounts: 6262,
      },
      {
        id: 'p3',
        portfolioName: 'Port 4',
        portfolioNumber: 'Port 4',
        date: '10 May 2025',
        numberOfAccounts: 435,
      },
      {
        id: 'p4',
        portfolioName: 'Port 7',
        portfolioNumber: 'Port 7',
        date: '10 May 2025',
        numberOfAccounts: 4,
      },
    ],
  },
  {
    id: '4',
    name: 'RDM_RH_39823_AutoOwners_ALL_19',
    portfolios: [
      {
        id: 'p5',
        portfolioName: 'Port A',
        portfolioNumber: 'Port A',
        date: '15 May 2025',
        numberOfAccounts: 120,
      },
      {
        id: 'p6',
        portfolioName: 'Port B',
        portfolioNumber: 'Port B',
        date: '15 May 2025',
        numberOfAccounts: 340,
      },
    ],
  },
];