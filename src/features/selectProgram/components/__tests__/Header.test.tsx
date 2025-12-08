import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useTheme } from '@/app/providers/ThemeProvider';

// Mock dependencies
jest.mock('@/app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));


describe('Header Component', () => {
  it('renders correctly with default theme', () => {
    (useTheme as jest.Mock).mockImplementation(() => ({ name: 'default', setName: jest.fn() }));
    render(<Header />);

    expect(screen.getByText('LYNX')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'logo-aspen.png');
    // Check for ThemeToggler content
    expect(screen.getByText('Aspen')).toBeInTheDocument();
    expect(screen.getByText('Sompo')).toBeInTheDocument();
  });

  it('renders correctly with other theme', () => {
    (useTheme as jest.Mock).mockImplementation(() => ({ name: 'sompo', setName: jest.fn() }));
    render(<Header />);

    expect(screen.getByText('LYNX')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'logo-sompo.png');
    expect(screen.getByText('Aspen')).toBeInTheDocument();
    expect(screen.getByText('Sompo')).toBeInTheDocument();
  });
});
