// ============= api/mocks/databaseMockData.ts =============
export interface Database {
  id: string;
  name: string;
  size: string;
  portfolios: number;
  treaties: number;
  cedants: number;
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'archived' | 'maintenance';
}

export const mockDatabases: Database[] = [
  {
    id: '1',
    name: 'EDM_RH_39823_AutoOwners_EQ_19',
    size: '93 MB',
    portfolios: 10,
    treaties: 3,
    cedants: 4,
    createdAt: '2024-01-15',
    updatedAt: '2024-11-05',
    status: 'active',
  },
  {
    id: '2',
    name: 'ZH_116751_BPCS_HD_25_EDM',
    size: '43 MB',
    portfolios: 123,
    treaties: 46,
    cedants: 5,
    createdAt: '2024-02-10',
    updatedAt: '2024-11-04',
    status: 'active',
  },
  {
    id: '3',
    name: 'ZH_117125_AXA_XL_Prop_HD_25_EDM',
    size: '891 MB',
    portfolios: 15,
    treaties: 1,
    cedants: 6,
    createdAt: '2024-03-05',
    updatedAt: '2024-11-03',
    status: 'active',
  },
  {
    id: '4',
    name: 'RDM_RH_39823_AutoOwners_ALL_19',
    size: '1 GB',
    portfolios: 34,
    treaties: 2,
    cedants: 21,
    createdAt: '2024-04-12',
    updatedAt: '2024-11-02',
    status: 'active',
  },
  {
    id: '5',
    name: 'ZH_117263_SVG_WS_CatXL_25_EDM',
    size: '3 GB',
    portfolios: 4,
    treaties: 0,
    cedants: 1,
    createdAt: '2024-05-20',
    updatedAt: '2024-11-01',
    status: 'active',
  },
  {
    id: '6',
    name: 'ZH_118310_SV_Sachsen_WS_25_EDM',
    size: '3 GB',
    portfolios: 3,
    treaties: 345,
    cedants: 1,
    createdAt: '2024-06-15',
    updatedAt: '2024-10-31',
    status: 'active',
  },
  {
    id: '7',
    name: 'ZH_117215_PZU_25_EDM',
    size: '2 GB',
    portfolios: 55,
    treaties: 4,
    cedants: 2,
    createdAt: '2024-07-10',
    updatedAt: '2024-10-30',
    status: 'active',
  },
  {
    id: '8',
    name: 'ZH_117163_LF_HD_Broker_25_EDM',
    size: '1 GB',
    portfolios: 30,
    treaties: 33,
    cedants: 43,
    createdAt: '2024-08-05',
    updatedAt: '2024-10-29',
    status: 'active',
  },
  {
    id: '9',
    name: 'RH_123049_AEGIS_QS_PPR_25_EDM',
    size: '119 MB',
    portfolios: 3,
    treaties: 83,
    cedants: 5,
    createdAt: '2024-09-01',
    updatedAt: '2024-10-28',
    status: 'active',
  },
  {
    id: '10',
    name: 'EDM_123456_GlobalRe_WS_25',
    size: '500 MB',
    portfolios: 45,
    treaties: 12,
    cedants: 8,
    createdAt: '2024-10-01',
    updatedAt: '2024-10-27',
    status: 'active',
  },
  {
    id: '11',
    name: 'ZH_119874_MunichRe_Prop_25_EDM',
    size: '1.5 GB',
    portfolios: 67,
    treaties: 23,
    cedants: 15,
    createdAt: '2024-09-15',
    updatedAt: '2024-10-26',
    status: 'maintenance',
  },
  {
    id: '12',
    name: 'RDM_125001_SwissRe_CatXL_25',
    size: '2.3 GB',
    portfolios: 89,
    treaties: 34,
    cedants: 19,
    createdAt: '2024-08-20',
    updatedAt: '2024-10-25',
    status: 'active',
  },
];

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};