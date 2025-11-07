// treatyRegionCoverageMockData.ts
export interface Region {
  id: string;
  name: string;
  checked: boolean;
  indeterminate?: boolean;
  children?: Region[];
}

export interface TreatyItem {
  id: string;
  database: string;
  treaty: string;
  checked: boolean;
}

export interface SelectedRegion {
  id: string;
  database: string;
  treaty: string;
  peril: string;
  region: string;
  includeExclude: 'Include' | 'Exclude';
}

export const mockTreatiesEQFF: TreatyItem[] = [
  {
    id: '1',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 1',
    checked: true,
  },
  {
    id: '2',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 7',
    checked: false,
  },
  {
    id: '3',
    database: 'RDM_RH_39823_AutoOwners_ALL_19',
    treaty: 'Treaty 20',
    checked: true,
  },
];

export const mockTreatiesIF: TreatyItem[] = [
  {
    id: '4',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 7',
    checked: false,
  },
  {
    id: '5',
    database: 'ZH_116751_BPCS_HD_25_EDM',
    treaty: 'Treaty 15',
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

export const mockSelectedRegions: SelectedRegion[] = [
  {
    id: '1',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 1',
    peril: 'EQ/FF',
    region: 'California',
    includeExclude: 'Include',
  },
  {
    id: '2',
    database: 'RDM_RH_39823_AutoOwners_ALL_19',
    treaty: 'Treaty 20',
    peril: 'EQ/FF',
    region: 'California',
    includeExclude: 'Include',
  },
  {
    id: '3',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 7',
    peril: 'IF',
    region: 'Germany',
    includeExclude: 'Exclude',
  },
];