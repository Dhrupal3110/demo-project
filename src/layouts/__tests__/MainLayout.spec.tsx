import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainLayout from '../MainLayout';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.unmock('react-redux');

// Mocks
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/program-123/database' };
const mockParams = { programId: 'program-123' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock feature components and hooks
const mockSaveStepData = jest.fn();
const mockValidateStep = jest.fn();
const mockSubmitAllData = jest.fn();

jest.mock('@/features/sidebarStepper', () => ({
  Sidebar: ({ handleSidebarClick }: any) => (
    <div data-testid="sidebar">
      <button onClick={() => handleSidebarClick(1)}>Go to Step 1</button>
    </div>
  ),
  StepperHeader: ({ handleNext, handlePrevious }: any) => (
    <div data-testid="stepper-header">
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
    </div>
  ),
  stepsData: Array.from({ length: 11 }, (_, i) => ({ id: i + 1, label: `Step ${i + 1}` })),
  useSidebarStepperApi: () => ({
    formData: {},
    loading: false,
    error: null,
    saving: false,
    saveStepData: mockSaveStepData,
    validateStep: mockValidateStep,
    submitAllData: mockSubmitAllData,
  }),
}));

// Helper to create store
const createTestStore = (initialState: any) => {
  return configureStore({
    reducer: {
      stepper: (state = initialState.stepper || {}) => state,
      program: (state = initialState.program || {}) => state,
    },
  });
};

describe('MainLayout', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockSaveStepData.mockReset();
    mockValidateStep.mockReset();
    mockSubmitAllData.mockReset();
    
    // Default implementations
    mockSaveStepData.mockResolvedValue({});
    mockValidateStep.mockResolvedValue({ valid: true });
    mockSubmitAllData.mockResolvedValue({});
    mockLocation.pathname = '/program-123/database';

    (jest.requireMock('react-hot-toast').error as jest.Mock).mockClear();
    (jest.requireMock('react-hot-toast').success as jest.Mock).mockClear();
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test('renders main layout components', () => {
    const store = createTestStore({
      stepper: { activeStep: 2, maxVisitedStep: 2, formData: {} },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('stepper-header')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  test('handleNext validates and saves data before navigating', async () => {
    mockValidateStep.mockResolvedValue({ valid: true });
    mockSaveStepData.mockResolvedValue({});

    const store = createTestStore({
      stepper: { activeStep: 2, maxVisitedStep: 2, formData: {} },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockValidateStep).toHaveBeenCalledWith(2, expect.anything());
      expect(mockSaveStepData).toHaveBeenCalledWith(2, expect.anything());
      expect(mockNavigate).toHaveBeenCalledWith('/program-123/portfolio');
    });
  });

  test('handleNext shows error if validation fails', async () => {
    mockValidateStep.mockResolvedValue({ valid: false, errors: { field: 'Error' } });

    const store = createTestStore({
      stepper: { activeStep: 2, maxVisitedStep: 2, formData: {} },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockValidateStep).toHaveBeenCalled();
      expect(mockSaveStepData).not.toHaveBeenCalled();
      expect(jest.requireMock('react-hot-toast').error).toHaveBeenCalledWith('Please fix the errors before proceeding');
    });
  });

  test('handleNext shows error if save fails', async () => {
    mockValidateStep.mockResolvedValue({ valid: true });
    mockSaveStepData.mockRejectedValue(new Error('Save failed'));

    const store = createTestStore({
      stepper: { activeStep: 2, maxVisitedStep: 2, formData: {} },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockSaveStepData).toHaveBeenCalled();
      expect(jest.requireMock('react-hot-toast').error).toHaveBeenCalledWith('An error occurred while proceeding');
    });
  });

  test('handleNext calls submitAllData on final step', async () => {
    mockLocation.pathname = '/program-123/review';
    mockValidateStep.mockResolvedValue({ valid: true });
    mockSubmitAllData.mockResolvedValue({ success: true, submissionId: '123' });

    const store = createTestStore({
      stepper: { activeStep: 11, maxVisitedStep: 11, formData: {} },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockSubmitAllData).toHaveBeenCalled();
      expect(jest.requireMock('react-hot-toast').success).toHaveBeenCalledWith('Form submitted successfully!');
    });
  });

  test('handlePrevious saves data and navigates back', async () => {
    mockLocation.pathname = '/program-123/portfolio';
    
    const store = createTestStore({
      stepper: { activeStep: 3, maxVisitedStep: 3, formData: { 2: {} } },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => {
      expect(mockSaveStepData).toHaveBeenCalledWith(3, expect.anything());
      expect(mockNavigate).toHaveBeenCalledWith('/program-123/database');
    });
  });

  test('handleSidebarClick saves data and navigates', async () => {
    mockSaveStepData.mockResolvedValue({});

    const store = createTestStore({
      stepper: { activeStep: 2, maxVisitedStep: 2, formData: {} },
      program: {
        selectedProgram: { id: 'program-123', name: 'Test Program' },
        allPrograms: [{ id: 'program-123', name: 'Test Program' }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Go to Step 1'));

    await waitFor(() => {
      expect(mockSaveStepData).toHaveBeenCalledWith(2, expect.anything());
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('redirects to home if no selected program', () => {
    const store = createTestStore({
      stepper: { activeStep: 2, formData: {} },
      program: { selectedProgram: null, allPrograms: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handles all steps correctly', async () => {
    const steps = [
      { id: 2, route: 'database' },
      { id: 3, route: 'portfolio' },
      { id: 4, route: 'demand-surge' },
      { id: 5, route: 'portfolio-peril' },
      { id: 6, route: 'portfolio-region' },
      { id: 7, route: 'treaties' },
      { id: 8, route: 'treaty-peril' },
      { id: 9, route: 'treaty-region' },
      { id: 10, route: 'link-portfolios' },
      { id: 11, route: 'review' },
    ];

    for (const step of steps) {
        // Setup
        mockLocation.pathname = `/program-123/${step.route}`;
        mockValidateStep.mockResolvedValue({ valid: true });
        mockSaveStepData.mockResolvedValue({});
        if (step.id === 11) {
             mockSubmitAllData.mockResolvedValue({ success: true });
        }

        const store = createTestStore({
            stepper: { activeStep: step.id, maxVisitedStep: step.id, formData: {} },
            program: {
                selectedProgram: { id: 'program-123', name: 'Test Program' },
                allPrograms: [{ id: 'program-123', name: 'Test Program' }],
            },
        });

        const { unmount } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <MainLayout />
                </MemoryRouter>
            </Provider>
        );

        // Trigger Next
        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockValidateStep).toHaveBeenCalledWith(step.id, expect.anything());
            // For step 11, save is called before submit
            expect(mockSaveStepData).toHaveBeenCalledWith(step.id, expect.anything());
        });
        
        // Cleanup
        unmount();
        jest.clearAllMocks();
    }
  });
});
