// demandSurgeMockData.ts
export interface DemandSurgeItem {
  id: string;
  databaseName: string;
  portfolioName: string;
  demandSurge: boolean;
  justification: string;
}

export const mockDemandSurgeItems: DemandSurgeItem[] = [
  {
    id: '1',
    databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolioName: 'Port 1',
    demandSurge: true,
    justification: '',
  },
  {
    id: '2',
    databaseName: 'EDM_RH_39823_AutoOwners_EQ_19',
    portfolioName: 'Port 7',
    demandSurge: true,
    justification: '',
  },
  {
    id: '3',
    databaseName: 'RDM_RH_39823_AutoOwners_ALL_19',
    portfolioName: 'Port 20',
    demandSurge: false,
    justification: 'Auto portfolio as per submission',
  },
];