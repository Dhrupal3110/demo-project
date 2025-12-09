import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import DatabaseForm from '../SelectDatabases';
import { useAllDatabases, useSearchDatabases } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUseAllDatabases = useAllDatabases as jest.Mock;
const mockUseSearchDatabases = useSearchDatabases as jest.Mock;

const mockDatabases = [
    {
        id: '1',
        name: 'DB 1',
        size: '100MB',
        portfolios: 5,
        treaties: 2,
        cedants: 1,
    },
    {
        id: '2',
        name: 'DB 2',
        size: '200MB',
        portfolios: 10,
        treaties: 4,
        cedants: 3,
    },
];

const renderWithStore = (component: React.ReactNode) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe('SelectDatabases Component', () => {
    beforeEach(() => {
        mockUseAllDatabases.mockReturnValue({
            data: { data: mockDatabases },
            isLoading: false,
            error: null,
        });
        mockUseSearchDatabases.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders database list correctly', () => {
        renderWithStore(<DatabaseForm />);
        expect(screen.getByText('2 - Select databases')).toBeInTheDocument();
        expect(screen.getByText('DB 1')).toBeInTheDocument();
        expect(screen.getByText('DB 2')).toBeInTheDocument();
    });

    test('handles search input change', async () => {
        renderWithStore(<DatabaseForm />);
        const searchInput = screen.getByPlaceholderText('Search by Database name');
        fireEvent.change(searchInput, { target: { value: 'DB 1' } });

        expect(searchInput).toHaveValue('DB 1');
        // Debounce wait
        await waitFor(() => {
            expect(mockUseSearchDatabases).toHaveBeenCalledWith('DB 1');
        });
    });

    test('handles checkbox toggle', () => {
        renderWithStore(<DatabaseForm />);
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).toBeChecked();

        // Toggle off
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).not.toBeChecked();
    });

    test('displays loading state', () => {
        mockUseAllDatabases.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });
        renderWithStore(<DatabaseForm />);
        expect(screen.getByText('Loading databases...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUseAllDatabases.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed to fetch' },
        });
        renderWithStore(<DatabaseForm />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
});
