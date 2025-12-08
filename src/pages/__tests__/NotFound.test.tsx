import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

// Mock the Header component since we only want to test NotFound logic
jest.mock('@/features/selectProgram', () => ({
  Header: () => <div data-testid="mock-header">Header Component</div>,
}));

describe('NotFound Component', () => {
  it('renders correctly with header, error message and home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    // Verify Header is present
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();

    // Verify Error Message
    expect(screen.getByRole('heading', { level: 1, name: /404 - Page Not Found/i })).toBeInTheDocument();

    // Verify Go Home Link
    const homeLink = screen.getByRole('link', { name: /go home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
