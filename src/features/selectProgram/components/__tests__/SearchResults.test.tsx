import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '../SearchResults';

// Mock ProgramList
jest.mock('../ProgramList', () => ({
  __esModule: true,
  default: ({ programs, onSelect, title }: any) => (
    <div data-testid="mock-program-list">
      <div>{title}</div>
      <ul>
        {programs.map((p: any) => (
          <li key={p.id} onClick={() => onSelect(p)}>
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

describe('SearchResults Component', () => {
  const mockResults = [
    { id: '1', name: 'Result 1' },
    { id: '2', name: 'Result 2' },
  ];
  const mockOnSelect = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders results count and clear button', () => {
    render(
      <SearchResults
        results={mockResults}
        searchQuery="test"
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('2 results found')).toBeInTheDocument();
    expect(screen.getByText('Clear Search')).toBeInTheDocument();
  });

  it('renders singular result count', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        searchQuery="test"
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('1 result found')).toBeInTheDocument();
  });

  it('renders ProgramList with results', () => {
    render(
      <SearchResults
        results={mockResults}
        searchQuery="test"
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByTestId('mock-program-list')).toBeInTheDocument();
    expect(screen.getByText('Result 1')).toBeInTheDocument();
    expect(screen.getByText('Result 2')).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    render(
      <SearchResults
        results={mockResults}
        searchQuery="test"
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );

    fireEvent.click(screen.getByText('Clear Search'));
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('renders no results message when results are empty', () => {
    render(
      <SearchResults
        results={[]}
        searchQuery="test query"
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('0 results found')).toBeInTheDocument();
    expect(screen.getByText('No results found for "test query"')).toBeInTheDocument();
    expect(screen.getByText('Try a different search term')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-program-list')).not.toBeInTheDocument();
  });
});
