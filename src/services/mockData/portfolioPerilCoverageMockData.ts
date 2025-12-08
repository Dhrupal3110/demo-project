// portfolioPerilCoverageMockData.ts
export interface PerilCoverage {
  [key: string]: boolean | 'partial';
}

export interface PortfolioPeril {
  id: string;
  database: string;
  portfolio: string;
  all: boolean;
  coverages: PerilCoverage;
}

export const mockPortfolioPerils: PortfolioPeril[] = [
  {
    id: '1',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 1',
    all: false,
    coverages: {
      EQ: true,
      WS: false,
      CS: false,
      FL: false,
      WF: 'partial',
      TR: false,
      WC: false,
    },
  },
  {
    id: '2',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 7',
    all: false,
    coverages: {
      EQ: true,
      WS: 'partial',
      CS: false,
      FL: false,
      WF: false,
      TR: false,
      WC: false,
    },
  },
  {
    id: '3',
    database: 'RDM_RH_39823_AutoOwners_ALL_19',
    portfolio: 'Port 20',
    all: false,
    coverages: {
      EQ: true,
      WS: 'partial',
      CS: 'partial',
      FL: 'partial',
      WF: 'partial',
      TR: 'partial',
      WC: 'partial',
    },
  },
];