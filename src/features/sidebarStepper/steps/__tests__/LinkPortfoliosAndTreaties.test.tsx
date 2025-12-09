import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import LinkPortfoliosTreatiesForm from '../LinkPortfoliosAndTreaties';

const renderWithStore = (component: React.ReactNode, initialState = {}) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
        preloadedState: {
            stepper: {
                activeStep: 10,
                maxVisitedStep: 10,
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

describe('LinkPortfoliosAndTreaties Component', () => {
    test('renders with initial data', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        expect(screen.getByText('10 – Link portfolios and treaties')).toBeInTheDocument();
        // Check for default portfolios and treaties (might effectively be multiple if in table too)
        expect(screen.getAllByText('Port 1').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Treaty 1').length).toBeGreaterThan(0);
    });

    test('handles database switching', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const db2Button = screen.getByText('RDM_RH_39823_AutoOwners_ALL_19');
        fireEvent.click(db2Button);
        // Verify style change or state update (implicit via re-render)
        expect(db2Button).toHaveClass('bg-(--color-surface)');
    });

    test('searches portfolios', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const searchInput = screen.getByPlaceholderText('Search by portfolio name');
        fireEvent.change(searchInput, { target: { value: 'Port 7' } });

        // Should find Port 7 in the list
        expect(screen.getByLabelText('Select portfolio Port 7')).toBeInTheDocument();
        // Should NOT find Port 1 in the list (checkbox)
        expect(screen.queryByLabelText('Select portfolio Port 1')).not.toBeInTheDocument();
    });

    test('searches treaties', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const searchInput = screen.getByPlaceholderText('Search by treaty name');
        fireEvent.change(searchInput, { target: { value: 'Treaty 7' } });

        // Should find Treaty 7 in the list
        expect(screen.getByLabelText('Select treaty Treaty 7')).toBeInTheDocument();
        // Should NOT find Treaty 1 in the list (checkbox)
        expect(screen.queryByLabelText('Select treaty Treaty 1')).not.toBeInTheDocument();
    });

    test('selects and deselects portfolios', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        // Find a checkbox for a portfolio - specific matching might be tricky so we rely on labels
        const port2Checkbox = screen.getByLabelText('Select portfolio Port 7');
        expect(port2Checkbox).not.toBeChecked();

        fireEvent.click(port2Checkbox);
        expect(port2Checkbox).toBeChecked();

        fireEvent.click(port2Checkbox);
        expect(port2Checkbox).not.toBeChecked();
    });

    test('selects and deselects treaties', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const treaty2Checkbox = screen.getByLabelText('Select treaty Treaty 7');
        expect(treaty2Checkbox).not.toBeChecked();

        fireEvent.click(treaty2Checkbox);
        expect(treaty2Checkbox).toBeChecked();
    });

    test('selects all portfolios', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const selectAll = screen.getByLabelText('Select all portfolios');

        // Initially some might be checked, so let's check it to select all
        fireEvent.click(selectAll); // If indeterminate or unchecked, clicking should toggle
        // Verify all portfolios checked
        const port1 = screen.getByLabelText('Select portfolio Port 1');
        const port2 = screen.getByLabelText('Select portfolio Port 7');
        expect(port1).toBeChecked();
        expect(port2).toBeChecked();

        // Deselect all
        fireEvent.click(selectAll);
        expect(port1).not.toBeChecked();
        expect(port2).not.toBeChecked();
    });

    test('selects all treaties', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const selectAll = screen.getByLabelText('Select all treaties');

        fireEvent.click(selectAll);
        const treaty1 = screen.getByLabelText('Select treaty Treaty 1');
        const treaty2 = screen.getByLabelText('Select treaty Treaty 7');

        expect(treaty1).toBeChecked();
        expect(treaty2).toBeChecked();
    });

    test('adds a linked item', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        // Ensure items are checked
        const port2Checkbox = screen.getByLabelText('Select portfolio Port 7') as HTMLInputElement;
        const treaty2Checkbox = screen.getByLabelText('Select treaty Treaty 7') as HTMLInputElement;

        if (!port2Checkbox.checked) fireEvent.click(port2Checkbox);
        if (!treaty2Checkbox.checked) fireEvent.click(treaty2Checkbox);

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);

        // Check if row added to table
        // We look for a row containing Port 7 and Treaty 7
        const rows = screen.getAllByRole('row');
        // Find row text. Port 7 and Treaty 7 should be present in the table body rows.
        const rowTexts = rows.map(r => r.textContent);
        const addedRow = rowTexts.find(t => t?.includes('Port 7') && t?.includes('Treaty 7'));
        expect(addedRow).toBeDefined();
    });

    test('does not add duplicate linked item', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        const addButton = screen.getByText('Add');
        // Default init has Port 1 + Treaty 1 linked, and they are checked.
        // Clicking Add should try to add them again but logic prevents duplicates

        // Count existing rows
        const initialRows = screen.getAllByRole('row').length;

        fireEvent.click(addButton);

        const afterRows = screen.getAllByRole('row').length;
        expect(afterRows).toBe(initialRows); // Shouldn't increase
    });

    test('removes a linked item', () => {
        renderWithStore(<LinkPortfoliosTreatiesForm />);
        // Get initial count
        const initialRemoveButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg.lucide-minus'));
        expect(initialRemoveButtons.length).toBeGreaterThan(0);

        fireEvent.click(initialRemoveButtons[0]);

        const afterRemoveButtons = screen.queryAllByRole('button').filter(b => b.querySelector('svg.lucide-minus'));
        expect(afterRemoveButtons.length).toBe(initialRemoveButtons.length - 1);
    });

    test('initializes data from props/redux', () => {
        // Mock pre-filled data
        const preloadedState = {
            formData: {
                10: {
                    portfolios: [{ id: '1', name: 'Custom Port', checked: true }],
                    treaties: [{ id: '1', name: 'Custom Treaty', lob: 'L', cedant: 'C', checked: true }],
                    linkedItems: [],
                    selectedDatabase: 'DB1'
                }
            }
        };
        renderWithStore(<LinkPortfoliosTreatiesForm />, preloadedState);
        expect(screen.getByText('Custom Port')).toBeInTheDocument();
        expect(screen.getByText('Custom Treaty')).toBeInTheDocument();
    });

    test('shows error message', () => {
        const preloadedState = {
            errors: {
                linkedItems: 'Required error'
            }
        };
        renderWithStore(<LinkPortfoliosTreatiesForm />, preloadedState);
        expect(screen.getByText('Required error')).toBeInTheDocument();
    });
});
