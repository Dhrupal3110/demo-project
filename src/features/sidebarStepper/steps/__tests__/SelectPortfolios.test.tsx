import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import PortfolioForm from '../SelectPortfolios';
import { usePortfolioApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUsePortfolioApi = usePortfolioApi as jest.Mock;

const mockDatabases = [
    {
        id: '1',
        name: 'DB 1',
        portfolios: [
            {
                id: 'p1',
                portfolioName: 'Portfolio 1',
                portfolioNumber: 'P001',
                date: '2024-01-01',
                numberOfAccounts: 10,
            },
            {
                id: 'p2',
                portfolioName: 'Portfolio 2',
                portfolioNumber: 'P002',
                date: '2024-01-02',
                numberOfAccounts: 20,
            },
        ],
    },
    {
        id: '2',
        name: 'DB 2',
        portfolios: [
            {
                id: 'p3',
                portfolioName: 'Portfolio 3',
                portfolioNumber: 'P003',
                date: '2024-01-03',
                numberOfAccounts: 30,
            },
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

describe('SelectPortfolios Component', () => {
    beforeEach(() => {
        mockUsePortfolioApi.mockReturnValue({
            databases: mockDatabases,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders portfolio list correctly', () => {
        renderWithStore(<PortfolioForm />);
        expect(screen.getByText('3 - Select portfolios')).toBeInTheDocument();
        expect(screen.getByText('Portfolio 1')).toBeInTheDocument();
        expect(screen.getByText('Portfolio 2')).toBeInTheDocument();
    });

    test('handles searching', () => {
        renderWithStore(<PortfolioForm />);
        const searchInput = screen.getByPlaceholderText('Search by Portfolio name');
        fireEvent.change(searchInput, { target: { value: 'Portfolio 1' } });

        expect(screen.getByText('Portfolio 1')).toBeInTheDocument();
        expect(screen.queryByText('Portfolio 2')).not.toBeInTheDocument();
    });

    test('handles tab switching', () => {
        renderWithStore(<PortfolioForm />);
        const db2Button = screen.getByText('DB 2');
        fireEvent.click(db2Button);

        expect(screen.getByText('Portfolio 3')).toBeInTheDocument();
        expect(screen.queryByText('Portfolio 1')).not.toBeInTheDocument();
    });

    test('handles checkbox selection', () => {
        renderWithStore(<PortfolioForm />);
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).toBeChecked();

        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).not.toBeChecked();
    });

    test('displays loading state', () => {
        mockUsePortfolioApi.mockReturnValue({
            databases: [],
            loading: true,
            error: null,
        });
        renderWithStore(<PortfolioForm />);
        expect(screen.getByText('Loading portfolios...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUsePortfolioApi.mockReturnValue({
            databases: [],
            loading: false,
            error: 'Failed to load',
        });
        renderWithStore(<PortfolioForm />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });
});
