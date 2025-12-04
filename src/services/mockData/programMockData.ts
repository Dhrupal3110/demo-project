// ============= api/mocks/programMockData.ts =============
import type { Program } from '@/features/selectProgram/types';

export const mockPrograms: Program[] = [
  {
    id: '20045',
    name: 'CAT',
    description: 'CAT',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-01',
    subscribeReference: '',
    arrowId: '20045',
    cedantName: 'AUTO OWNERS INSURANCE COMPANY',
  },
  {
    id: 'P007238090PG',
    name: 'PROPERTY CAT XL 20090101 AIUK',
    description: 'PROPERTY CAT XL 20090101 AIUK',
    status: 'active',
    createdAt: '2024-03-20',
    updatedAt: '2024-10-28',
    subscribeReference: 'P007238090PG',
    arrowId: '',
    cedantName: 'MACIF',
  },
  {
    id: '18433',
    name: 'PROPERTY',
    description: 'PROPERTY',
    status: 'active',
    createdAt: '2024-02-10',
    updatedAt: '2024-10-25',
    subscribeReference: '',
    arrowId: '18433',
    cedantName: 'NODAK MUTUAL INSURANCE COMPANY',
  },
  {
    id: '21826',
    name: 'Cat XL',
    description: 'Cat XL',
    status: 'active',
    createdAt: '2024-01-05',
    updatedAt: '2024-10-20',
    subscribeReference: 'PoA05CR110PG',
    arrowId: '21826, 11575',
    cedantName: 'Auto & General',
  },
  {
    id: 'P007256090PG',
    name: 'PROP CAT XL PROGRAMME 2',
    description: 'PROP CAT XL PROGRAMME 2',
    status: 'active',
    createdAt: '2024-04-12',
    updatedAt: '2024-10-15',
    subscribeReference: 'P007256090PG',
    arrowId: '',
    cedantName: 'EUREKO RE',
  },
];

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};