import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import DemandSurgeForm from '../SetDemandSurge';
import { useDemandSurgeApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUseDemandSurgeApi = useDemandSurgeApi as jest.Mock;

const mockItems = [
    {
        id: '1',
        databaseName: 'DB 1',
        portfolioName: 'Port 1',
        demandSurge: false,
        justification: '',
    },
    {
        id: '2',
        databaseName: 'DB 1',
        portfolioName: 'Port 2',
        demandSurge: true,
        justification: 'Previous Logic',
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

describe('SetDemandSurge Component', () => {
    beforeEach(() => {
        mockUseDemandSurgeApi.mockReturnValue({
            items: mockItems,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders demand surge table', () => {
        renderWithStore(<DemandSurgeForm />);
        expect(screen.getByText('4 – Set demand surge')).toBeInTheDocument();
        expect(screen.getByText('Port 1')).toBeInTheDocument();
        expect(screen.getByText('Port 2')).toBeInTheDocument();
    });

    test('handles filtering', () => {
        renderWithStore(<DemandSurgeForm />);
        const portfolioSearch = screen.getByPlaceholderText('Search by portfolio name');
        fireEvent.change(portfolioSearch, { target: { value: 'Port 1' } });

        expect(screen.getByText('Port 1')).toBeInTheDocument();
        expect(screen.queryByText('Port 2')).not.toBeInTheDocument();
    });

    test('handles toggle change', () => {
        renderWithStore(<DemandSurgeForm />);
        const toggles = screen.getAllByRole('checkbox'); // Checkbox variant=toggle uses checkbox input
        expect(toggles[0]).not.toBeChecked();

        fireEvent.click(toggles[0]);
        expect(toggles[0]).toBeChecked();
    });

    test('handles justification change', () => {
        renderWithStore(<DemandSurgeForm />);
        const inputs = screen.getAllByRole('textbox');
        // First two are search, next are justification inputs in table
        // Assuming table rows > 0.
        // The inputs in table rows are: searchDB, searchPort, then justification inputs per row.
        // Actually search inputs are type="text". Justification inputs are type="text".
        // 2 search inputs + 2 justification inputs = 4 total textbox roles.
        const justificationInput = inputs[2]; // First row justification

        fireEvent.change(justificationInput, { target: { value: 'New Justification' } });
        expect(justificationInput).toHaveValue('New Justification');
    });

    test('displays loading state', () => {
        mockUseDemandSurgeApi.mockReturnValue({
            items: [],
            loading: true,
            error: null,
        });
        renderWithStore(<DemandSurgeForm />);
        expect(screen.getByText('Loading demand surge items...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUseDemandSurgeApi.mockReturnValue({
            items: [],
            loading: false,
            error: 'Error loading',
        });
        renderWithStore(<DemandSurgeForm />);
        expect(screen.getByText('Error loading')).toBeInTheDocument();
    });
});
