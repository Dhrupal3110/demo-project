import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import ReviewAnalyses from '../ReviewAndFinalize';
import { useReviewAnalysesApi } from '@/features/sidebarStepper/hooks';

// Mock hooks
jest.mock('@/features/sidebarStepper/hooks');
const mockUseReviewAnalysesApi = useReviewAnalysesApi as jest.Mock;

const mockAnalysis = {
    id: '1',
    databaseName: 'DB 1',
    portfolioName: 'Port 1',
    numTreaties: 5,
    profile: 'Profile 1',
    currency: 'USD',
    priority: 'Low',
    expanded: false,
};

const mockData = {
    analyses: [mockAnalysis],
    context: 'Test Context',
    currencyOptions: ['USD', 'EUR'],
    priorityOptions: ['Low', 'High'],
    contextOptions: ['Test Context', 'Other Context'],
};

const mockUpdateAnalysisCurrency = jest.fn();
const mockUpdateAnalysisPriority = jest.fn();
const mockUpdateContext = jest.fn();
const mockToggleExpanded = jest.fn();

const renderWithStore = (component: React.ReactNode) => {
    const store = configureStore({
        reducer: {
            stepper: stepperReducer,
        },
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe('ReviewAndFinalize Component', () => {
    beforeEach(() => {
        mockUseReviewAnalysesApi.mockReturnValue({
            reviewData: mockData,
            loading: false,
            error: null,
            updateAnalysisCurrency: mockUpdateAnalysisCurrency,
            updateAnalysisPriority: mockUpdateAnalysisPriority,
            updateContext: mockUpdateContext,
            toggleExpanded: mockToggleExpanded,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders review list', () => {
        renderWithStore(<ReviewAnalyses />);
        expect(screen.getByText('11 – Review analyses')).toBeInTheDocument();
        expect(screen.getByText('DB 1')).toBeInTheDocument();
        expect(screen.getByText('Port 1')).toBeInTheDocument();
    });

    test('handles searching', () => {
        renderWithStore(<ReviewAnalyses />);
        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'Port 1' } });
        expect(screen.getByText('Port 1')).toBeInTheDocument();
    });

    test('handles currency change', async () => {
        renderWithStore(<ReviewAnalyses />);
        // Find the currency select. It has current value 'USD'.
        // There are two select boxes per row (currency, priority) plus context select at bottom.
        // The currency select for row 1.
        const selects = screen.getAllByRole('combobox');
        const currencySelect = selects[0];

        fireEvent.change(currencySelect, { target: { value: 'EUR' } });
        await waitFor(() => {
            expect(mockUpdateAnalysisCurrency).toHaveBeenCalledWith('1', 'EUR');
        });
    });

    test('handles priority change', async () => {
        renderWithStore(<ReviewAnalyses />);
        const selects = screen.getAllByRole('combobox');
        const prioritySelect = selects[1];

        fireEvent.change(prioritySelect, { target: { value: 'High' } });
        await waitFor(() => {
            expect(mockUpdateAnalysisPriority).toHaveBeenCalledWith('1', 'High');
        });
    });

    test('handles context change', async () => {
        renderWithStore(<ReviewAnalyses />);
        const selects = screen.getAllByRole('combobox');
        const contextSelect = selects[2];

        fireEvent.change(contextSelect, { target: { value: 'Other Context' } });
        await waitFor(() => {
            expect(mockUpdateContext).toHaveBeenCalledWith('Other Context');
        });
    });

    test('handles toggle expand', async () => {
        renderWithStore(<ReviewAnalyses />);
        // The expand button contains the numTreaties text (5)
        // It's a button.
        const expandButton = screen.getByText('5').closest('button');
        if (expandButton) {
            fireEvent.click(expandButton);
            await waitFor(() => {
                expect(mockToggleExpanded).toHaveBeenCalledWith('1');
            });
        }
    });

    test('displays loading state', () => {
        mockUseReviewAnalysesApi.mockReturnValue({
            reviewData: null,
            loading: true,
            error: null,
        });
        renderWithStore(<ReviewAnalyses />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays error state', () => {
        mockUseReviewAnalysesApi.mockReturnValue({
            reviewData: null,
            loading: false,
            error: 'Failed to fetch',
        });
        renderWithStore(<ReviewAnalyses />);
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
});
