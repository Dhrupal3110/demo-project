// portfolioRegionCoverageMockData.ts
export interface Region {
  id: string;
  name: string;
  checked: boolean;
  indeterminate?: boolean;
  children?: Region[];
}

export interface PortfolioItem {
  id: string;
  database: string;
  portfolio: string;
  checked: boolean;
}

export interface SelectedCoverage {
  id: string;
  database: string;
  portfolio: string;
  peril: string;
  region: string;
  includeExclude: 'Include' | 'Exclude';
}

export const mockPortfoliosEQFF: PortfolioItem[] = [
  {
    id: '1',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 1',
    checked: true,
  },
  {
    id: '2',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 7',
    checked: false,
  },
  {
    id: '3',
    database: 'RDM_RH_39823_AutoOwners_ALL_19',
    portfolio: 'Port 20',
    checked: true,
  },
];

export const mockPortfoliosIF: PortfolioItem[] = [
  {
    id: '4',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 7',
    checked: false,
  },
  {
    id: '5',
    database: 'ZH_116751_BPCS_HD_25_EDM',
    portfolio: 'Port 15',
    checked: false,
  },
];

export const mockRegionsEQFF: Region[] = [
  {
    id: 'worldwide',
    name: 'Worldwide',
    checked: false,
    indeterminate: true,
    children: [
      {
        id: 'us',
        name: 'United States',
        checked: false,
        indeterminate: true,
        children: [
          { id: 'california', name: 'California', checked: true },
          { id: 'pnw', name: 'Pacific North West', checked: false },
        ],
      },
      {
        id: 'canada',
        name: 'Canada',
        checked: false,
        children: [],
      },
    ],
  },
];

export const mockRegionsIF: Region[] = [
  {
    id: 'worldwide-if',
    name: 'Worldwide',
    checked: false,
    children: [
      {
        id: 'europe',
        name: 'Europe',
        checked: false,
        children: [
          { id: 'germany', name: 'Germany', checked: false },
          { id: 'france', name: 'France', checked: false },
        ],
      },
    ],
  },
];

export const mockSelectedCoverage: SelectedCoverage[] = [
  {
    id: '1',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 1',
    peril: 'EQ/FF',
    region: 'California',
    includeExclude: 'Include',
  },
  {
    id: '2',
    database: 'RDM_RH_39823_AutoOwners_ALL_19',
    portfolio: 'Port 20',
    peril: 'EQ/FF',
    region: 'California',
    includeExclude: 'Include',
  },
  {
    id: '3',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolio: 'Port 7',
    peril: 'IF',
    region: 'Germany',
    includeExclude: 'Exclude',
  },
];