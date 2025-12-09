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
        {
            id: 'r1',
            name: 'Worldwide',
            checked: false,
            children: [
                { id: 'r1-1', name: 'North America', checked: false, children: [] }
            ]
        }
    ],
    regionsIF: [
        { id: 'r2', name: 'USA', checked: false, children: [] }
    ],
    selectedCoverage: []
};


const renderWithStore = (component: React.ReactNode, initialState = {}) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
        preloadedState: {
            stepper: {
                activeStep: 6,
                maxVisitedStep: 6,
                formData: {},
                errors: {},
                isSubmitted: false,
                submissionId: '',
                ...initialState,
            }
        }
    });
    return { store, ...render(<Provider store={store}>{component}</Provider>) };
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

    test('renders and displays default list (EQ/FF)', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        expect(screen.getByText('6 – Set portfolio region coverage')).toBeInTheDocument();
        expect(screen.getByText('Port1')).toBeInTheDocument();
        expect(screen.queryByText('Port3')).not.toBeInTheDocument(); // IF portfolio
    });

    test('switches Peril to IF', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const ifButton = screen.getByText('IF');
        fireEvent.click(ifButton);

        expect(screen.getByText('Port3')).toBeInTheDocument();
        expect(screen.queryByText('Port1')).not.toBeInTheDocument();

        // Regions also switch
        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.queryByText('Worldwide')).not.toBeInTheDocument();
    });

    test('expands and collapses regions', () => {
        const expandedMock = {
            ...mockData,
            regionsEQFF: [
                {
                    id: 'r1',
                    name: 'RegionParent',
                    checked: false,
                    children: [
                        { id: 'r1-1', name: 'RegionChild', checked: false, children: [] }
                    ]
                }
            ],
        };
        mockUsePortfolioRegionCoverageApi.mockReturnValue({ data: expandedMock, loading: false, error: null });

        renderWithStore(<PortfolioRegionCoverageForm />);

        // Parent visible
        expect(screen.getByText('RegionParent')).toBeInTheDocument();

        // Child visible initially? The code sets default expanded to ['worldwide', 'us']. 
        expect(screen.queryByText('RegionChild')).not.toBeInTheDocument();

        // Find expand button
        const expandButtons = screen.getAllByRole('button');
        const expandBtn = expandButtons.find(b => b.querySelector('svg.lucide-chevron-right'));
        expect(expandBtn).toBeDefined();

        if (expandBtn) {
            fireEvent.click(expandBtn);
            expect(screen.getByText('RegionChild')).toBeInTheDocument();

            // Collapse
            fireEvent.click(expandBtn);
            expect(screen.queryByText('RegionChild')).not.toBeInTheDocument();
        }
    });

    test('selects parent region selects children', () => {
        const recursiveMock = {
            ...mockData,
            regionsEQFF: [
                {
                    id: 'r1',
                    name: 'Parent',
                    checked: false,
                    children: [
                        { id: 'c1', name: 'Child', checked: false, children: [] }
                    ]
                }
            ],
        };
        mockUsePortfolioRegionCoverageApi.mockReturnValue({ data: recursiveMock, loading: false, error: null });

        renderWithStore(<PortfolioRegionCoverageForm />);

        const expandBtn = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-chevron-right'));
        if (expandBtn) fireEvent.click(expandBtn);

        const parentCheckbox = screen.getByLabelText('Select region Parent') as HTMLInputElement;
        const childCheckbox = screen.getByLabelText('Select region Child') as HTMLInputElement;

        expect(parentCheckbox.checked).toBe(false);
        expect(childCheckbox.checked).toBe(false);

        fireEvent.click(parentCheckbox);

        expect(parentCheckbox.checked).toBe(true);
        expect(childCheckbox.checked).toBe(true);

        // Deselect child
        fireEvent.click(childCheckbox);

        expect(parentCheckbox.checked).toBe(false);
        expect(childCheckbox.checked).toBe(false);
    });

    test('select all portfolios check', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const selectAll = screen.getByLabelText('Select all EDM portfolios');

        fireEvent.click(selectAll);

        const p1 = screen.getByLabelText('Select portfolio Port1') as HTMLInputElement;
        const p2 = screen.getByLabelText('Select portfolio Port2') as HTMLInputElement;

        expect(p1.checked).toBe(true);
        expect(p2.checked).toBe(true);
    });

    test('adds selected items', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const p1 = screen.getByLabelText('Select portfolio Port1');
        const r1 = screen.getByLabelText('Select region Worldwide');

        fireEvent.click(p1);
        fireEvent.click(r1);

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);

        // Expected to add leaf node "North America", not "Worldwide" (parent)
        const rows = screen.getAllByRole('row');
        const added = rows.some(r => r.textContent?.includes('Port1') && r.textContent?.includes('North America'));
        expect(added).toBe(true);
    });

    test('removes selected items', () => {
        const prefilledState = {
            formData: {
                6: {
                    ...mockData,
                    selectedCoverage: [{
                        id: 'existing-1',
                        database: 'DB1',
                        portfolio: 'Port1',
                        peril: 'EQ/FF',
                        region: 'Worldwide',
                        includeExclude: 'Include'
                    }]
                }
            }
        };
        renderWithStore(<PortfolioRegionCoverageForm />, prefilledState);

        // Worldwide text is in region list AND in table row
        const worldwideTexts = screen.getAllByText('Worldwide');
        expect(worldwideTexts.length).toBeGreaterThan(0);

        const removeButtons = screen.getAllByRole('button');
        const removeBtn = removeButtons.find(b => b.querySelector('svg.lucide-minus'));

        expect(removeBtn).toBeDefined();
        if (removeBtn) {
            fireEvent.click(removeBtn);
        }

        expect(screen.getByText('No coverage data')).toBeInTheDocument();
    });

    test('handles search filter', () => {
        renderWithStore(<PortfolioRegionCoverageForm />);
        const searchInput = screen.getByPlaceholderText('Search by EDM - Portfolio name');

        fireEvent.change(searchInput, { target: { value: 'Port2' } });
        expect(screen.getByLabelText('Select portfolio Port2')).toBeVisible();
        expect(screen.queryByLabelText('Select portfolio Port1')).not.toBeInTheDocument();
    });
});
