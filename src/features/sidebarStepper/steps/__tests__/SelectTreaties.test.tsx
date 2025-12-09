import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import TreatiesForm from '../SelectTreaties';
import { useTreatiesApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUseTreatiesApi = useTreatiesApi as jest.Mock;

const mockDatabases = [
    {
        id: '1',
        name: 'DB 1',
        treaties: [
            {
                id: 't1',
                name: 'Treaty 1',
                num: 'T01',
                date: '2024-01-01',
                limit: '1M',
                cedant: 'Cedant 1',
                lob: 'Prop',
            },
            {
                id: 't2',
                name: 'Treaty 2',
                num: 'T02',
                date: '2024-01-02',
                limit: '2M',
                cedant: 'Cedant 2',
                lob: 'Cas',
            },
        ],
    },
    {
        id: '2',
        name: 'DB 2',
        treaties: [
            {
                id: 't3',
                name: 'Treaty 3',
                num: 'T03',
                date: '2024-01-01',
                limit: '1M',
                cedant: 'Cedant 1',
                lob: 'Prop',
            }
        ]
    }
];

const renderWithStore = (component: React.ReactNode) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe('SelectTreaties Component', () => {
    beforeEach(() => {
        mockUseTreatiesApi.mockReturnValue({
            databases: mockDatabases,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders treaties list', () => {
        renderWithStore(<TreatiesForm />);
        expect(screen.getByText('7 – Select treaties')).toBeInTheDocument();
        expect(screen.getByText('Treaty 1')).toBeInTheDocument();
        expect(screen.getByText('Treaty 2')).toBeInTheDocument();
    });

    test('handles searching', () => {
        renderWithStore(<TreatiesForm />);
        const searchInput = screen.getByPlaceholderText('Search by Treaty name');
        fireEvent.change(searchInput, { target: { value: 'Treaty 1' } });

        expect(screen.getByText('Treaty 1')).toBeInTheDocument();
        expect(screen.queryByText('Treaty 2')).not.toBeInTheDocument();
    });

    test('handles tab switching', () => {
        renderWithStore(<TreatiesForm />);
        const db2Button = screen.getByText('DB 2');
        fireEvent.click(db2Button);

        expect(screen.getByText('Treaty 3')).toBeInTheDocument();
        expect(screen.queryByText('Treaty 1')).not.toBeInTheDocument();
    });

    test('handles checkbox selection', () => {
        renderWithStore(<TreatiesForm />);
        const checkboxes = screen.getAllByRole('checkbox');
        // First checkbox
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).toBeChecked();

        // Toggle
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).not.toBeChecked();
    });

    test('displays loading state', () => {
        mockUseTreatiesApi.mockReturnValue({
            databases: [],
            loading: true,
            error: null,
        });
        renderWithStore(<TreatiesForm />);
        expect(screen.getByText('Loading treaties...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUseTreatiesApi.mockReturnValue({
            databases: [],
            loading: false,
            error: 'Failed to fetch',
        });
        renderWithStore(<TreatiesForm />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
});
