// treatyPerilCoverageMockData.ts
export interface PerilCoverage {
  [key: string]: boolean;
}

export interface TreatyPeril {
  id: string;
  database: string;
  treaty: string;
  all: boolean;
  coverages: PerilCoverage;
}

export const mockTreatyPerils: TreatyPeril[] = [
  {
    id: '1',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 1',
    all: false,
    coverages: {
      EQ: true,
      WS: false,
      CS: false,
      FL: false,
      WF: false,
      TR: false,
      WC: false,
    },
  },
  {
    id: '2',
    database: 'EDM_RH_39823_AutoOwners_EQ_19',
    treaty: 'Treaty 7',
    all: false,
    coverages: {
      EQ: true,
      WS: false,
      CS: false,
      FL: false,
      WF: false,
      TR: false,
      WC: false,
    },
  },
  {
    id: '3',
    database: 'RDM_RH_39823_AutoOwners_AL_19',
    treaty: 'Treaty 20',
    all: false,
    coverages: {
      EQ: true,
      WS: false,
      CS: false,
      FL: false,
      WF: false,
      TR: false,
      WC: false,
    },
  },
];

export const perils = ['All', 'EQ', 'WS', 'CS', 'FL', 'WF', 'TR', 'WC'];