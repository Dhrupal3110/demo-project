import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import PortfolioRegionCoverageForm from '../SetPortfolioRegionCoverage';
import { usePortfolioRegionCoverageApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUsePortfolioRegionCoverageApi = usePortfolioRegionCoverageApi as jest.Mock;

const mockData = {
    portfoliosEQFF: [
        { id: '1', database: 'DB1', portfolio: 'Port1', checked: false },
        { id: '2', database: 'DB1', portfolio: 'Port2', checked: false }
    ],
    portfoliosIF: [
        { id: '3', database: 'DB2', portfolio: 'Port3', checked: false }
    ],
    regionsEQFF: [
        { id: 'r1', name: 'Worldwide', checked: false, children: [] }
    ],
    regionsIF: [
        { id: 'r2', name: 'USA', checked: false, children: [] }
    ],
    selectedCoverage: []
};

const renderWithStore = (component: React.ReactNode) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe('SetPortfolioRegionCoverage Component', () => {
    beforeEach(() => {
        mockUsePortfolioRegionCoverageApi.mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        expect(screen.getByText('6 – Set portfolio region coverage')).toBeInTheDocument();
        expect(screen.getByText('Port1')).toBeInTheDocument();
    });

    test('handles searching', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const searchInput = screen.getByPlaceholderText('Search by EDM - Portfolio name');
        fireEvent.change(searchInput, { target: { value: 'Port1' } });

        expect(screen.getByText('Port1')).toBeInTheDocument();
        expect(screen.queryByText('Port2')).not.toBeInTheDocument();
    });

    test('handles switching perils tabs', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const ifButton = screen.getByText('IF');
        fireEvent.click(ifButton);
        expect(screen.getByText('Port3')).toBeInTheDocument();
    });

    test('handles selecting portfolio', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const portfolioCheckbox = screen.getByLabelText('Select portfolio Port1');
        fireEvent.click(portfolioCheckbox);
    });

    test('handles selecting region', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const regionCheckbox = screen.getByLabelText('Select region Worldwide');
        fireEvent.click(regionCheckbox);
    });

    test('handleAdd adds items', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        // Select portfolio
        const portfolioCheckbox = screen.getByLabelText('Select portfolio Port1');
        fireEvent.click(portfolioCheckbox);

        // Select region
        const regionCheckbox = screen.getByLabelText('Select region Worldwide');
        fireEvent.click(regionCheckbox);

        // Click Add
        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
    });

    test('displays loading state', () => {
        mockUsePortfolioRegionCoverageApi.mockReturnValue({
            data: null,
            loading: true,
            error: null,
        });
        renderWithStore(<PortfolioRegionCoverageForm />);
        expect(screen.getByText('Loading portfolio region coverage...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUsePortfolioRegionCoverageApi.mockReturnValue({
            data: null,
            loading: false,
            error: 'Failed to fetch',
        });
        renderWithStore(<PortfolioRegionCoverageForm />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
});
