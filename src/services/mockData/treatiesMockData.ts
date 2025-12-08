// treatiesMockData.ts
export interface Treaty {
  id: string;
  name: string;
  num: string;
  date: string;
  limit: string;
  cedant: string;
  lob: string;
  databaseId: string;
}

export interface Database {
  id: string;
  name: string;
  treaties: Treaty[];
}

export const mockDatabases: Database[] = [
  {
    id: '1',
    name: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaties: [
      {
        id: 't1',
        name: 'Treaty 1',
        num: 'Treaty 1',
        date: '10 May 2025',
        limit: '5,000',
        cedant: 'Cedant 1',
        lob: 'Property',
        databaseId: '1',
      },
      {
        id: 't2',
        name: 'Treaty 2',
        num: 'Treaty 2',
        date: '10 May 2025',
        limit: '10,000',
        cedant: 'Cedant 2',
        lob: 'Marine',
        databaseId: '1',
      },
      {
        id: 't3',
        name: 'Treaty 4',
        num: 'Treaty 4',
        date: '10 May 2025',
        limit: '34,000,000',
        cedant: 'Cedant 4',
        lob: 'Property',
        databaseId: '1',
      },
      {
        id: 't4',
        name: 'Treaty 7',
        num: 'Treaty 7',
        date: '10 May 2025',
        limit: '4,000,000',
        cedant: 'Cedant 7',
        lob: 'Property',
        databaseId: '1',
      },
    ],
  },
  {
    id: '4',
    name: 'RDM_RH_39823_AutoOwners_ALL_19',
    treaties: [
      {
        id: 't5',
        name: 'Treaty A',
        num: 'Treaty A',
        date: '15 May 2025',
        limit: '2,500,000',
        cedant: 'Cedant A',
        lob: 'Casualty',
        databaseId: '4',
      },
      {
        id: 't6',
        name: 'Treaty B',
        num: 'Treaty B',
        date: '15 May 2025',
        limit: '8,000,000',
        cedant: 'Cedant B',
        lob: 'Property',
        databaseId: '4',
      },
    ],
  },
];