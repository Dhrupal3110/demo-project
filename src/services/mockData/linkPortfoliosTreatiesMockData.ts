export interface Portfolio {
  id: string;
  name: string;
  checked: boolean;
}

export interface Treaty {
  id: string;
  name: string;
  lob: string;
  cedant: string;
  checked: boolean;
}

export interface LinkedItem {
  id: string;
  database: string;
  portfolio: string;
  treaty: string;
}

export interface LinkData {
  databases: string[];
  portfolios: Portfolio[];
  treaties: Treaty[];
  linkedItems: LinkedItem[];
}

export const mockLinkData: LinkData = {
  databases: [
    'EDM_RH_39823_AutoOwners_EQ_19',
    'RDM_RH_39823_AutoOwners_ALL_19',
  ],
  portfolios: [
    { id: '1', name: 'Port 1', checked: false },
    { id: '2', name: 'Port 2', checked: false },
    { id: '3', name: 'Port 3', checked: false },
    { id: '4', name: 'Port 4', checked: false },
    { id: '5', name: 'Port 5', checked: false },
    { id: '6', name: 'Port 6', checked: false },
    { id: '7', name: 'Port 7', checked: false },
    { id: '8', name: 'Port 8', checked: false },
  ],
  treaties: [
    {
      id: '1',
      name: 'Treaty 1',
      lob: 'Property',
      cedant: 'Cedant A',
      checked: false,
    },
    {
      id: '2',
      name: 'Treaty 2',
      lob: 'Casualty',
      cedant: 'Cedant B',
      checked: false,
    },
    {
      id: '3',
      name: 'Treaty 3',
      lob: 'Property',
      cedant: 'Cedant C',
      checked: false,
    },
    {
      id: '4',
      name: 'Treaty 4',
      lob: 'Marine',
      cedant: 'Cedant A',
      checked: false,
    },
    {
      id: '5',
      name: 'Treaty 5',
      lob: 'Aviation',
      cedant: 'Cedant D',
      checked: false,
    },
    {
      id: '6',
      name: 'Treaty 6',
      lob: 'Casualty',
      cedant: 'Cedant B',
      checked: false,
    },
    {
      id: '7',
      name: 'Treaty 7',
      lob: 'Property',
      cedant: 'Cedant E',
      checked: false,
    },
  ],
  linkedItems: [
    {
      id: '1',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolio: 'Port 1',
      treaty: 'Treaty 1',
    },
    {
      id: '2',
      database: 'EDM_RH_39823_AutoOwners_EQ_19',
      portfolio: 'Port 2',
      treaty: 'Treaty 2',
    },
  ],
};