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
    selectedRegions: []
};


const renderWithStore = (component: React.ReactNode, initialState = {}) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
        preloadedState: {
            stepper: {
                activeStep: 9,
                maxVisitedStep: 9,
                formData: {},
                errors: {},
                isSubmitted: false, // Ensure type safety
                submissionId: '',
                ...initialState,
            }
        }
    });
    return { store, ...render(<Provider store={store}>{component}</Provider>) };
};

describe('SetTreatyRegionCoverage Component', () => {
    beforeEach(() => {
        mockUseTreatyRegionCoverageApi.mockReturnValue({
            ...mockData,
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders and displays default list (EQ/FF)', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        expect(screen.getByText('9 – Set treaty region coverage')).toBeInTheDocument();
        expect(screen.getByText('Treaty1')).toBeInTheDocument();
        expect(screen.queryByText('Treaty3')).not.toBeInTheDocument(); // IF treaty
    });

    test('switches Peril to IF', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const ifButton = screen.getByText('IF');
        fireEvent.click(ifButton);

        expect(screen.getByText('Treaty3')).toBeInTheDocument();
        expect(screen.queryByText('Treaty1')).not.toBeInTheDocument();

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
        mockUseTreatyRegionCoverageApi.mockReturnValue({ ...expandedMock, loading: false, error: null });

        renderWithStore(<TreatyRegionCoverageForm />);

        // Parent visible
        expect(screen.getByText('RegionParent')).toBeInTheDocument();

        // Child visible initially? The code sets default expanded to ['worldwide', 'us']. 'RegionParent' is not in default.
        // So child should NOT be visible.
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
            // It might still be in DOM but hidden or removed. Logic removes it from render traversal.
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
        mockUseTreatyRegionCoverageApi.mockReturnValue({ ...recursiveMock, loading: false, error: null });

        // Default expanded is ['worldwide'], so 'Parent' might not be expanded. 
        // Need to expand it first to see child checkbox.

        renderWithStore(<TreatyRegionCoverageForm />);

        const expandBtn = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-chevron-right'));
        if (expandBtn) fireEvent.click(expandBtn);

        const parentCheckbox = screen.getByLabelText('Select region Parent') as HTMLInputElement;
        const childCheckbox = screen.getByLabelText('Select region Child') as HTMLInputElement;

        expect(parentCheckbox.checked).toBe(false);
        expect(childCheckbox.checked).toBe(false);

        fireEvent.click(parentCheckbox);

        // Since state is managed by Redux/Component, checking re-render
        // However, the component relies on `data` from Redux. 
        // The test environment's redux update should propagate.
        expect(parentCheckbox.checked).toBe(true);
        expect(childCheckbox.checked).toBe(true);

        // Deselect child
        fireEvent.click(childCheckbox);

        // Parent should become indeterminate/unchecked (indeterminate logic handles visual minus, checked becomes false)
        expect(parentCheckbox.checked).toBe(false);
        expect(childCheckbox.checked).toBe(false);
    });

    test('select all treaties check', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const selectAll = screen.getByLabelText('Select all EDM treaties');

        fireEvent.click(selectAll);

        const t1 = screen.getByLabelText('Select treaty Treaty1') as HTMLInputElement;
        const t2 = screen.getByLabelText('Select treaty Treaty2') as HTMLInputElement;

        expect(t1.checked).toBe(true);
        expect(t2.checked).toBe(true);
    });

    test('adds selected items', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const t1 = screen.getByLabelText('Select treaty Treaty1');
        const r1 = screen.getByLabelText('Select region Worldwide'); // No children in default mock for r1

        fireEvent.click(t1);
        fireEvent.click(r1);

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);

        // Global ('Worldwide') is a parent. Logic only adds leaf nodes.
        // So we expect 'North America' (the child) to be added.
        const rows = screen.getAllByRole('row');
        const added = rows.some(r => r.textContent?.includes('Treaty1') && r.textContent?.includes('North America'));
        expect(added).toBe(true);
    });

    test('removes selected items', () => {
        const prefilledState = {
            formData: {
                9: {
                    ...mockData,
                    selectedRegions: [{
                        id: 'existing-1',
                        database: 'DB1',
                        treaty: 'Treaty1',
                        peril: 'EQ/FF',
                        region: 'Worldwide',
                        includeExclude: 'Include'
                    }]
                }
            }
        };
        renderWithStore(<TreatyRegionCoverageForm />, prefilledState);

        // Worldwide text is in region list AND in table row
        const worldwideTexts = screen.getAllByText('Worldwide');
        expect(worldwideTexts.length).toBeGreaterThan(0);

        const removeButtons = screen.getAllByRole('button');
        const removeBtn = removeButtons.find(b => b.querySelector('svg.lucide-minus')); // Table minus button

        expect(removeBtn).toBeDefined();
        if (removeBtn) {
            fireEvent.click(removeBtn);
        }

        // Should be gone from table. So count of "Worldwide" should decrease or "No coverage data" should appear.
        expect(screen.getByText('No coverage data')).toBeInTheDocument();
    });

    test('handles search filter', () => {
        renderWithStore(<TreatyRegionCoverageForm />);
        const searchInput = screen.getByPlaceholderText('Search by EDM - treaty name');

        fireEvent.change(searchInput, { target: { value: 'Treaty2' } });
        expect(screen.getByLabelText('Select treaty Treaty2')).toBeVisible();
        expect(screen.queryByLabelText('Select treaty Treaty1')).not.toBeInTheDocument();
    });
});
