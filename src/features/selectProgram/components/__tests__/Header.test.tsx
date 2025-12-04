import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useTheme } from '@/app/providers/ThemeProvider';

// Mock dependencies
jest.mock('@/app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/components/ui', () => ({
  ThemeToggler: () => <div data-testid="mock-theme-toggler">ThemeToggler</div>,
}));

// Mock images
jest.mock('@/assets/logo-aspen.png', () => ({ default: 'logo-aspen.png' }));
jest.mock('@/assets/logo-sompo.png', () => ({ default: 'logo-sompo.png' }));

describe('Header Component', () => {
  it('renders correctly with default theme', () => {
    (useTheme as jest.Mock).mockReturnValue({ name: 'default' });
    render(<Header />);

    expect(screen.getByText('LYNX')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'logo-aspen.png');
    expect(screen.getByTestId('mock-theme-toggler')).toBeInTheDocument();
  });

  it('renders correctly with other theme', () => {
    (useTheme as jest.Mock).mockReturnValue({ name: 'sompo' });
    render(<Header />);

    expect(screen.getByText('LYNX')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'logo-sompo.png');
    expect(screen.getByTestId('mock-theme-toggler')).toBeInTheDocument();
  });
});
