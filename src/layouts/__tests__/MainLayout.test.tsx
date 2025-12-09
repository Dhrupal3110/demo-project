import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainLayout from '../MainLayout';
import { createWrapper } from '@/test/test-utils';
import { useSidebarStepperApi } from '@/features/sidebarStepper';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();
const mockUseParams = jest.fn().mockReturnValue({ programId: 'p1' });
const mockUseLocation = jest.fn().mockReturnValue({ pathname: '/p1/database' });

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => mockUseSelector(selector),
}));

jest.mock('@/features/sidebarStepper', () => ({
    ...jest.requireActual('@/features/sidebarStepper'),
    useSidebarStepperApi: jest.fn(),
    Sidebar: ({ handleSidebarClick }: any) => (
        <div data-testid="sidebar">
            <button onClick={() => handleSidebarClick(2)}>Go to Step 2</button>
        </div>
    ),
    StepperHeader: ({ handleNext, handlePrevious }: any) => (
        <div data-testid="stepper-header">
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
        </div>
    ),
}));

jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn(),
}));

describe('MainLayout', () => {
    const mockSaveStepData = jest.fn();
    const mockValidateStep = jest.fn();
    const mockSubmitAllData = jest.fn();

    const defaultStepperState = {
        activeStep: 1,
        maxVisitedStep: 1,
        formData: {},
    };

    const defaultProgramState = {
        selectedProgram: { id: 'p1', name: 'Program 1' },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Default selector mock
        mockUseSelector.mockImplementation((selector: any) => {
            const state = {
                stepper: defaultStepperState,
                program: defaultProgramState
            };
            return selector(state);
        });

        (useSidebarStepperApi as jest.Mock).mockReturnValue({
            formData: {},
            loading: false,
            error: null,
            saving: false,
            saveStepData: mockSaveStepData,
            validateStep: mockValidateStep,
            submitAllData: mockSubmitAllData,
        });
    });

    test('renders loading state', () => {
        (useSidebarStepperApi as jest.Mock).mockReturnValue({
            loading: true,
        });
        render(<MainLayout />, { wrapper: createWrapper() });
        expect(screen.getByText(/Loading form data/i)).toBeInTheDocument();
    });

    test('renders error state', () => {
        (useSidebarStepperApi as jest.Mock).mockReturnValue({
            error: 'API Error',
        });
        render(<MainLayout />, { wrapper: createWrapper() });
        expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    test('redirects if no selected program', () => {
        const stateWithoutProgram = { ...defaultProgramState, selectedProgram: null };
        mockUseSelector.mockImplementation((selector: any) => {
            return selector({ stepper: defaultStepperState, program: stateWithoutProgram });
        });

        render(<MainLayout />, { wrapper: createWrapper() });
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handleNext validates and saves data', async () => {
        // Mock activeStep 2 (Database)
        const state = {
            stepper: { ...defaultStepperState, activeStep: 2 },
            program: defaultProgramState
        };
        mockUseSelector.mockImplementation((selector: any) => selector(state));
        mockUseLocation.mockReturnValue({ pathname: '/p1/database' });

        mockValidateStep.mockResolvedValue({ valid: true });
        mockSaveStepData.mockResolvedValue({});

        render(<MainLayout />, { wrapper: createWrapper() });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => expect(mockValidateStep).toHaveBeenCalledWith(2, expect.any(Object)));
        await waitFor(() => expect(mockSaveStepData).toHaveBeenCalledWith(2, expect.any(Object)));

        // Should navigate to next step (3 => portfolio)
        // Note: stepsData length check logic implies next step navigation
        expect(mockNavigate).toHaveBeenCalledWith('/p1/portfolio');
    });

    test('handleNext stops on validation error', async () => {
        // Mock activeStep 2
        const state = {
            stepper: { ...defaultStepperState, activeStep: 2 },
            program: defaultProgramState
        };
        mockUseSelector.mockImplementation((selector: any) => selector(state));
        mockUseLocation.mockReturnValue({ pathname: '/p1/database' });

        mockValidateStep.mockResolvedValue({ valid: false, errors: { field: 'error' } });

        render(<MainLayout />, { wrapper: createWrapper() });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => expect(mockValidateStep).toHaveBeenCalled());
        expect(mockSaveStepData).not.toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'stepper/setErrors', payload: { field: 'error' } }));
    });

    test('handlePrevious saves data and navigates back', async () => {
        // Mock activeStep 3
        const state = {
            stepper: { ...defaultStepperState, activeStep: 3 },
            program: defaultProgramState
        };
        mockUseSelector.mockImplementation((selector: any) => selector(state));
        mockUseLocation.mockReturnValue({ pathname: '/p1/portfolio' });

        render(<MainLayout />, { wrapper: createWrapper() });

        fireEvent.click(screen.getByText('Previous'));

        await waitFor(() => expect(mockSaveStepData).toHaveBeenCalledWith(3, expect.any(Object)));
        expect(mockNavigate).toHaveBeenCalledWith('/p1/database');
    });

    // Special case: Step 7 (Treaties) skipping to Review (Step 11) if no treaties
    test('skips to review if no treaties on step 7', async () => {
        const state = {
            stepper: { ...defaultStepperState, activeStep: 7, formData: { 7: { treaties: [] } } },
            program: defaultProgramState
        };
        mockUseSelector.mockImplementation((selector: any) => selector(state));
        mockUseLocation.mockReturnValue({ pathname: '/p1/treaties' });

        mockValidateStep.mockResolvedValue({ valid: true });

        render(<MainLayout />, { wrapper: createWrapper() });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/p1/review'));
    });
});
