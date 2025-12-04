import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectProgram from '../SelectProgram';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useRecentPrograms,
  useSearchBySubscribeReference,
  useSearchByArrowId,
  useSearchByCedantName,
} from '@/features/selectProgram/api/useProgramApi';
import { setSelectedProgram } from '@/features/selectProgram';
import { resetStepper } from '@/features/sidebarStepper/stepperSlice';

// Mock apiConfig to avoid import.meta issues
jest.mock('@/services/config/apiConfig', () => ({
  API_CONFIG: {
    BASE_URL: 'http://mock-api',
    TIMEOUT: 1000,
    HEADERS: {},
  },
}));

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/features/selectProgram/api/useProgramApi');
jest.mock('@/features/selectProgram', () => ({
  setSelectedProgram: jest.fn(),
}));
jest.mock('@/features/sidebarStepper/stepperSlice', () => ({
  resetStepper: jest.fn(),
}));

// Mock child components to isolate SelectProgram logic
jest.mock('@/features/selectProgram/components', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
  ProgramList: ({ programs, onSelect, title }: any) => (
    <div data-testid="mock-program-list">
      <h2>{title}</h2>
      <ul>
        {programs.map((p: any) => (
          <li key={p.id} onClick={() => onSelect(p)}>
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  ),
  SearchResults: ({ results, onSelect, onClear, searchQuery }: any) => (
    <div data-testid="mock-search-results">
      <button onClick={onClear}>Clear Search</button>
      {results.length === 0 ? (
        <div>No results found for "{searchQuery}"</div>
      ) : (
        <ul>
          {results.map((p: any) => (
            <li key={p.id} onClick={() => onSelect(p)}>
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
}));

describe('SelectProgram Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const mockPrograms = [
    { id: '1', name: 'Program 1', arrowId: '123', subscribeReference: 'SUB1', cedantName: 'Cedant 1' },
    { id: '2', name: 'Program 2', arrowId: '456', subscribeReference: 'SUB2', cedantName: 'Cedant 2' },
  ];

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    // Default mock implementations
    (useRecentPrograms as jest.Mock).mockReturnValue({
      data: mockPrograms,
      isLoading: false,
      error: null,
    });
    (useSearchBySubscribeReference as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useSearchByArrowId as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useSearchByCedantName as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial state', () => {
    render(<SelectProgram />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByText('Search by Subscribe Reference')).toBeInTheDocument();
    expect(screen.getByText('Search by Arrow ID')).toBeInTheDocument();
    expect(screen.getByText('Search by Cedant Name')).toBeInTheDocument();
    
    // Should show recent programs by default
    expect(screen.getByTestId('mock-program-list')).toBeInTheDocument();
    expect(screen.getByText('Or, select a recent program')).toBeInTheDocument();
    expect(screen.getByText('Program 1')).toBeInTheDocument();
  });

  it('shows loading state when fetching recent programs', () => {
    (useRecentPrograms as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(<SelectProgram />);
    
    // Check for spinner (implementation detail: class "animate-spin")
    // Since we can't easily query by class without setup, we can check that ProgramList is NOT present
    expect(screen.queryByTestId('mock-program-list')).not.toBeInTheDocument();
    // Or check for the container of the spinner
    const { container } = render(<SelectProgram />);
    expect(container.getElementsByClassName('animate-spin').length).toBeGreaterThan(0);
  });

  it('shows error message when recent programs fetch fails', () => {
    (useRecentPrograms as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
    });

    render(<SelectProgram />);
    
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('performs search by Subscribe Reference', async () => {
    const searchResults = [{ id: '3', name: 'Search Result 1' }];
    (useSearchBySubscribeReference as jest.Mock).mockReturnValue({
      data: searchResults,
      isLoading: false,
      error: null,
    });

    render(<SelectProgram />);

    const input = screen.getByPlaceholderText('e.g. PoAoG41250PG');
    fireEvent.change(input, { target: { value: 'test-ref' } });
    
    const searchButton = input.nextElementSibling as HTMLElement; // The button is next to input
    fireEvent.click(searchButton);

    // Should switch to search results view
    expect(screen.queryByTestId('mock-program-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-search-results')).toBeInTheDocument();
    expect(screen.getByText('Search Result 1')).toBeInTheDocument();
    
    expect(useSearchBySubscribeReference).toHaveBeenCalledWith('test-ref');
  });

  it('performs search by Arrow ID', () => {
    const searchResults = [{ id: '4', name: 'Arrow Result' }];
    (useSearchByArrowId as jest.Mock).mockReturnValue({
      data: searchResults,
      isLoading: false,
      error: null,
    });

    render(<SelectProgram />);

    const input = screen.getByPlaceholderText('e.g. 107311');
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByTestId('mock-search-results')).toBeInTheDocument();
    expect(screen.getByText('Arrow Result')).toBeInTheDocument();
    expect(useSearchByArrowId).toHaveBeenCalledWith('12345');
  });

  it('performs search by Cedant Name', () => {
    const searchResults = [{ id: '5', name: 'Cedant Result' }];
    (useSearchByCedantName as jest.Mock).mockReturnValue({
      data: searchResults,
      isLoading: false,
      error: null,
    });

    render(<SelectProgram />);

    const input = screen.getByPlaceholderText('e.g. AUTO OWNERS');
    fireEvent.change(input, { target: { value: 'Cedant X' } });
    
    // Find button by text "Search" - there are 3, so we need the specific one or use index
    // The inputs are in order: Subscribe, Arrow, Cedant.
    // Let's use the button next to the input
    const button = input.parentElement?.querySelector('button');
    fireEvent.click(button!);

    expect(screen.getByTestId('mock-search-results')).toBeInTheDocument();
    expect(screen.getByText('Cedant Result')).toBeInTheDocument();
    expect(useSearchByCedantName).toHaveBeenCalledWith('Cedant X');
  });

  it('clears search results', () => {
    // Setup active search state
    (useSearchBySubscribeReference as jest.Mock).mockReturnValue({
      data: [{ id: '1', name: 'Res' }],
      isLoading: false,
      error: null,
    });

    render(<SelectProgram />);

    // Trigger search
    const input = screen.getByPlaceholderText('e.g. PoAoG41250PG');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Verify search results are shown
    expect(screen.getByTestId('mock-search-results')).toBeInTheDocument();

    // Click clear
    fireEvent.click(screen.getByText('Clear Search'));

    // Should revert to recent programs
    expect(screen.getByTestId('mock-program-list')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-search-results')).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('handles program selection', async () => {
    render(<SelectProgram />);

    // Click a program from the list
    const programItem = screen.getByText('Program 1');
    fireEvent.click(programItem);

    expect(mockDispatch).toHaveBeenCalled();
    expect(resetStepper).toHaveBeenCalled();
    expect(setSelectedProgram).toHaveBeenCalledWith(mockPrograms[0]);
    
    // Wait for async dispatch to complete (though our mocks are sync, the component uses await)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/1/database');
    });
  });

  it('handles search loading state', () => {
    (useSearchBySubscribeReference as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    const { container } = render(<SelectProgram />);

    // Trigger search state
    const input = screen.getByPlaceholderText('e.g. PoAoG41250PG');
    fireEvent.change(input, { target: { value: 'loading...' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should show loading spinner
    expect(container.getElementsByClassName('animate-spin').length).toBeGreaterThan(0);
  });

  it('handles search error state', () => {
    (useSearchBySubscribeReference as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: { message: 'Search failed' },
    });

    render(<SelectProgram />);

    // Trigger search state
    const input = screen.getByPlaceholderText('e.g. PoAoG41250PG');
    fireEvent.change(input, { target: { value: 'error...' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Search failed')).toBeInTheDocument();
  });

  it('handles program selection error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (setSelectedProgram as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('Selection failed');
    });

    render(<SelectProgram />);

    const programItem = screen.getByText('Program 1');
    fireEvent.click(programItem);

    expect(mockDispatch).toHaveBeenCalled();
    // Should log error
    expect(consoleSpy).toHaveBeenCalledWith('Error selecting program:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });


  it('shows not found screen when search returns no results', () => {
    (useSearchBySubscribeReference as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<SelectProgram />);

    const input = screen.getByPlaceholderText('e.g. PoAoG41250PG');
    fireEvent.change(input, { target: { value: 'non-existent' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('mock-search-results')).toBeInTheDocument();
    expect(screen.getByText('No results found for "non-existent"')).toBeInTheDocument();
  });
});
