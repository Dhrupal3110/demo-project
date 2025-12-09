import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import TreatyRegionCoverageForm from '../SetTreatyRegionCoverage';
import { useTreatyRegionCoverageApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUseTreatyRegionCoverageApi = useTreatyRegionCoverageApi as jest.Mock;

const mockData = {
    treatiesEQFF: [
        { id: '1', database: 'DB1', treaty: 'Treaty1', checked: false },
        { id: '2', database: 'DB1', treaty: 'Treaty2', checked: false }
    ],
    treatiesIF: [
        { id: '3', database: 'DB2', treaty: 'Treaty3', checked: false }
    ],
    regionsEQFF: [
        { id: 'r1', name: 'Worldwide', checked: false, children: [] }
    ],
    regionsIF: [
        { id: 'r2', name: 'USA', checked: false, children: [] }
    ],
    selectedRegions: []
};


const renderWithStore = (component: React.ReactNode) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe('SetTreatyRegionCoverage Component', () => {
    beforeEach(() => {
        mockUseTreatyRegionCoverageApi.mockReturnValue({
            ...mockData, // Spread the mockData 
            // But hooks returns separate fields not just data object
            treatiesEQFF: mockData.treatiesEQFF,
            treatiesIF: mockData.treatiesIF,
            regionsEQFF: mockData.regionsEQFF,
            regionsIF: mockData.regionsIF,
            selectedRegions: mockData.selectedRegions,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        expect(screen.getByText('9 – Set treaty region coverage')).toBeInTheDocument();
        expect(screen.getByText('Treaty1')).toBeInTheDocument();
    });

    test('handles searching', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const searchInput = screen.getByPlaceholderText('Search by EDM - treaty name');
        fireEvent.change(searchInput, { target: { value: 'Treaty1' } });

        expect(screen.getByText('Treaty1')).toBeInTheDocument();
        expect(screen.queryByText('Treaty2')).not.toBeInTheDocument();
    });

    test('handles selecting treaty', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const treatyCheckbox = screen.getByLabelText('Select treaty Treaty1');
        fireEvent.click(treatyCheckbox);
    });

    test('handles selecting region', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const regionCheckbox = screen.getByLabelText('Select region Worldwide');
        fireEvent.click(regionCheckbox);
    });

    test('handleAdd adds items', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const treatyCheckbox = screen.getByLabelText('Select treaty Treaty1');
        fireEvent.click(treatyCheckbox);

        const regionCheckbox = screen.getByLabelText('Select region Worldwide');
        fireEvent.click(regionCheckbox);

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
    });

    test('displays loading state', () => {
        mockUseTreatyRegionCoverageApi.mockReturnValue({
            treatiesEQFF: [],
            loading: true,
            error: null,
        });
        renderWithStore(<TreatyRegionCoverageForm />);
        expect(screen.getByText('Loading treaty region coverage...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUseTreatyRegionCoverageApi.mockReturnValue({
            treatiesEQFF: [],
            loading: false,
            error: 'Failed to fetch',
        });
        renderWithStore(<TreatyRegionCoverageForm />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
});
