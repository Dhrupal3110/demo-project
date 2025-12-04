import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggler } from '../ThemeToggler';

// Mock the useTheme hook
const mockSetName = jest.fn();
jest.mock('@/app/providers/ThemeProvider', () => ({
  useTheme: () => ({
    name: 'default',
    setName: mockSetName,
  }),
}));

describe('ThemeToggler', () => {
  beforeEach(() => {
    mockSetName.mockClear();
  });

  test('renders theme buttons', () => {
    render(<ThemeToggler />);
    expect(screen.getByText('Aspen')).toBeInTheDocument();
    expect(screen.getByText('Sompo')).toBeInTheDocument();
  });

  test('calls setName when buttons are clicked', () => {
    render(<ThemeToggler />);
    
    fireEvent.click(screen.getByText('Sompo'));
    expect(mockSetName).toHaveBeenCalledWith('sompo');

    fireEvent.click(screen.getByText('Aspen'));
    expect(mockSetName).toHaveBeenCalledWith('default');
  });

  test('indicates active state', () => {
    render(<ThemeToggler />);
    // Based on the mock, 'default' is active
    const aspenButton = screen.getByText('Aspen');
    const sompoButton = screen.getByText('Sompo');

    expect(aspenButton).toHaveAttribute('aria-pressed', 'true');
    expect(sompoButton).toHaveAttribute('aria-pressed', 'false');
  });
});
