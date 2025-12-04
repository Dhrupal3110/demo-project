import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(
      <SearchBar
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByPlaceholderText('e.g. 107311 or AUTO OWNERS')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('calls onSearchChange when typing', () => {
    render(
      <SearchBar
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByPlaceholderText('e.g. 107311 or AUTO OWNERS');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('test');
  });

  test('calls onSearch when clicking search button', () => {
    render(
      <SearchBar
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    fireEvent.click(screen.getByText('Search'));

    expect(mockOnSearch).toHaveBeenCalled();
  });

  test('calls onSearch when pressing Enter', () => {
    render(
      <SearchBar
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByPlaceholderText('e.g. 107311 or AUTO OWNERS');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSearch).toHaveBeenCalled();
  });

  test('shows clear button when query is present and calls onClear when clicked', () => {
    render(
      <SearchBar
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Clear button should be visible (it has an X icon, usually we find by role or icon)
    // The X icon from lucide-react renders an svg.
    // We can find the button wrapping it.
    // The button has classes "absolute right-32..."
    // Let's try to find by role 'button' and filter? Or just assume it's the one that is not "Search".
    
    // Actually, X icon might have a hidden text or we can add aria-label.
    // But I can't modify the component easily without permission (though I can).
    // Let's assume the X icon renders an SVG.
    // I'll try to find the button that contains the SVG or use querySelector.
    
    // Better: add aria-label to the clear button in the component?
    // Or just find by class or hierarchy.
    
    // Let's try finding all buttons.
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find(btn => !btn.textContent?.includes('Search'));
    
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton!);
    
    expect(mockOnClear).toHaveBeenCalled();
  });

  test('does not show clear button when query is empty', () => {
    render(
      <SearchBar
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find(btn => !btn.textContent?.includes('Search'));
    
    expect(clearButton).toBeUndefined();
  });
});
