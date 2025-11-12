// ============= api/mocks/programMockData.ts =============
import type { Program } from '@/features/searchProgram/types';

export const mockPrograms: Program[] = [
  {
    id: 'PRG001',
    name: 'Customer Loyalty Program',
    description: 'Rewards program for loyal customers',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-01',
  },
  {
    id: 'PRG002',
    name: 'Summer Sales Campaign',
    description: 'Special discounts for summer season',
    status: 'active',
    createdAt: '2024-03-20',
    updatedAt: '2024-10-28',
  },
  {
    id: 'PRG003',
    name: 'New Customer Welcome',
    description: 'Onboarding program for new customers',
    status: 'active',
    createdAt: '2024-02-10',
    updatedAt: '2024-10-25',
  },
  {
    id: 'PRG004',
    name: 'VIP Membership',
    description: 'Exclusive benefits for VIP members',
    status: 'active',
    createdAt: '2024-01-05',
    updatedAt: '2024-10-20',
  },
  {
    id: 'PRG005',
    name: 'Referral Program',
    description: 'Earn rewards by referring friends',
    status: 'active',
    createdAt: '2024-04-12',
    updatedAt: '2024-10-15',
  },
  {
    id: 'PRG006',
    name: 'Holiday Special 2024',
    description: 'Year-end holiday promotions',
    status: 'draft',
    createdAt: '2024-10-01',
    updatedAt: '2024-11-05',
  },
  {
    id: 'PRG007',
    name: 'Student Discount Program',
    description: 'Special rates for students',
    status: 'active',
    createdAt: '2024-05-20',
    updatedAt: '2024-10-10',
  },
  {
    id: 'PRG008',
    name: 'Corporate Partnership',
    description: 'B2B partnership program',
    status: 'active',
    createdAt: '2024-06-15',
    updatedAt: '2024-10-05',
  },
  {
    id: 'PRG009',
    name: 'Early Bird Offers',
    description: 'Limited time early morning deals',
    status: 'paused',
    createdAt: '2024-07-01',
    updatedAt: '2024-09-30',
  },
  {
    id: 'PRG010',
    name: 'Birthday Rewards',
    description: 'Special treats on customer birthdays',
    status: 'active',
    createdAt: '2024-08-10',
    updatedAt: '2024-10-28',
  },
];

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};