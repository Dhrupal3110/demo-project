export interface Step {
  id: number;
  title: string;
  component: string;
  prev: string;
}

export const stepsData: Step[] = [
  { id: 1, title: 'Select program', component: 'ProgramForm', prev: '' },
  {
    id: 2,
    title: 'Select databases',
    component: 'DatabaseForm',
    prev: 'Edit Program selection',
  },
  {
    id: 3,
    title: 'Select portfolios',
    component: 'PortfolioForm',
    prev: 'Edit database selection',
  },
  {
    id: 4,
    title: 'Set demand surge',
    component: 'DemandSurgeForm',
    prev: 'Edit portfolio selection',
  },
  {
    id: 5,
    title: 'Set portfolio peril coverage',
    component: 'PortfolioPerilCoverageForm',
    prev: 'Edit demand surge',
  },
  {
    id: 6,
    title: 'Set portfolio region coverage',
    component: 'RegionCoverageForm',
    prev: 'Edit portfolio peril coverage',
  },
  {
    id: 7,
    title: 'Select treaties',
    component: 'TreatySelectionForm',
    prev: 'Edit portfolio region coverage',
  },
  {
    id: 8,
    title: 'Set treaty peril coverage',
    component: 'TreatyPerilForm',
    prev: 'Edit treaty selection',
  },
  {
    id: 9,
    title: 'Set treaty region coverage',
    component: 'TreatyRegionForm',
    prev: 'Edit treaty peril coverage',
  },
  {
    id: 10,
    title: 'Link portfolios and treaties',
    component: 'LinkForm',
    prev: 'Edit treaty region coverage',
  },
  {
    id: 11,
    title: 'Review and finalize',
    component: 'ReviewForm',
    prev: 'Edit portfolio selection',
  },
];
