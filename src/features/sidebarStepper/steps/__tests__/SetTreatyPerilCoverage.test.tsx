import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import TreatyPerilCoverageForm from '../SetTreatyPerilCoverage';
import { useTreatyPerilCoverageApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUseTreatyPerilCoverageApi = useTreatyPerilCoverageApi as jest.Mock;

const mockItems = [
    {
        id: '1',
        database: 'DB A',
        treaty: 'Treaty A',
        all: false,
        coverages: {
            EQ: true,
            WS: false,
            CS: true,
            FL: false,
            WF: true,
            TR: false,
            WC: true
        },
    },
    {
        id: '2',
        database: 'DB B',
        treaty: 'Treaty B',
        all: false,
        coverages: {
            EQ: false,
            WS: true,
            CS: false,
            FL: true,
            WF: false,
            TR: true,
            WC: false
        },
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

describe('SetTreatyPerilCoverage Component', () => {
    beforeEach(() => {
        mockUseTreatyPerilCoverageApi.mockReturnValue({
            treatyPerils: mockItems,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', () => {
        renderWithStore(<TreatyPerilCoverageForm />);
        expect(screen.getByText('8 – Set treaty peril coverage')).toBeInTheDocument();
        expect(screen.getByText('Treaty A')).toBeInTheDocument();
    });

    test('handles searching', () => {
        renderWithStore(<TreatyPerilCoverageForm />);
        const searchInput = screen.getByPlaceholderText('Search database - treaty name');
        fireEvent.change(searchInput, { target: { value: 'Treaty A' } });

        expect(screen.getByText('Treaty A')).toBeInTheDocument();
        expect(screen.queryByText('Treaty B')).not.toBeInTheDocument();
    });

    test('handles header checkbox', () => {
        renderWithStore(<TreatyPerilCoverageForm />);
        const eqHeaderCheckbox = screen.getByLabelText('Toggle EQ coverage column');
        fireEvent.click(eqHeaderCheckbox);
    });

    test('handles all checkbox for row', () => {
        renderWithStore(<TreatyPerilCoverageForm />);
        const rowAllCheckbox = screen.getByLabelText('Toggle all coverages for Treaty A');
        fireEvent.click(rowAllCheckbox);
    });

    test('displays loading state', () => {
        mockUseTreatyPerilCoverageApi.mockReturnValue({
            treatyPerils: [],
            loading: true,
            error: null,
        });
        renderWithStore(<TreatyPerilCoverageForm />);
        expect(screen.getByText('Loading treaty peril coverage...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUseTreatyPerilCoverageApi.mockReturnValue({
            treatyPerils: [],
            loading: false,
            error: 'Failed to fetch',
        });
        renderWithStore(<TreatyPerilCoverageForm />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
});
