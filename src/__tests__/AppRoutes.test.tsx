import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';

// Mock child components to isolate AppRoutes logic and ensure fast, deterministic tests.
// We mock MainLayout to render an Outlet so nested routes can be displayed.
jest.mock('@/layouts/MainLayout', () => {
  const { Outlet } = require('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div data-testid="main-layout">
        MainLayout
        <Outlet />
      </div>
    ),
  };
});

jest.mock('@/pages/SelectProgram', () => ({
  __esModule: true,
  default: () => <div data-testid="select-program">SelectProgram Page</div>,
}));

jest.mock('@/pages/SubmissionSuccess', () => ({
  __esModule: true,
  default: () => <div data-testid="submission-success">SubmissionSuccess Page</div>,
}));

jest.mock('@/pages/NotFound', () => ({
  __esModule: true,
  default: () => <div data-testid="not-found">NotFound Page</div>,
}));

jest.mock('@/components/common', () => ({
  __esModule: true,
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}));

jest.mock('@/features/sidebarStepper', () => ({
  __esModule: true,
  SelectDatabases: () => <div data-testid="select-databases">SelectDatabases</div>,
  SelectPortfolios: () => <div data-testid="select-portfolios">SelectPortfolios</div>,
  SetDemandSurge: () => <div data-testid="set-demand-surge">SetDemandSurge</div>,
  SetPortfolioPerilCoverage: () => <div data-testid="set-portfolio-peril">SetPortfolioPerilCoverage</div>,
  SetPortfolioRegionCoverage: () => <div data-testid="set-portfolio-region">SetPortfolioRegionCoverage</div>,
  SelectTreaties: () => <div data-testid="select-treaties">SelectTreaties</div>,
  SetTreatyPerilCoverage: () => <div data-testid="set-treaty-peril">SetTreatyPerilCoverage</div>,
  SetTreatyRegionCoverage: () => <div data-testid="set-treaty-region">SetTreatyRegionCoverage</div>,
  LinkPortfoliosAndTreaties: () => <div data-testid="link-portfolios">LinkPortfoliosAndTreaties</div>,
  ReviewAndFinalize: () => <div data-testid="review-finalize">ReviewAndFinalize</div>,
}));

describe('AppRoutes', () => {
  // Coverage plan:
  // - AppRoutes primarily defines the routing structure.
  // - We test that each path renders the correct component.
  // - We test the redirect logic.
  // - We test the 404 case.
  // - Loading states and API errors are handled within the page components (SelectProgram, etc.), 
  //   which are mocked here. We focus on the routing logic itself.

  test('renders SelectProgram at root path /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId('select-program')).toBeInTheDocument();
  });

  test('renders SubmissionSuccess at /:programId/success', () => {
    render(
      <MemoryRouter initialEntries={['/123/success']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId('submission-success')).toBeInTheDocument();
  });

  test('redirects /:programId to /:programId/database', async () => {
    render(
      <MemoryRouter initialEntries={['/123']}>
        <AppRoutes />
      </MemoryRouter>
    );
    // Should render MainLayout and then redirect to database
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    await waitFor(() => {
        expect(screen.getByTestId('select-databases')).toBeInTheDocument();
    });
  });

  test('renders SelectDatabases at /:programId/database', () => {
    render(
      <MemoryRouter initialEntries={['/123/database']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId('select-databases')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  const routes = [
    { path: '/123/portfolio', testId: 'select-portfolios' },
    { path: '/123/demand-surge', testId: 'set-demand-surge' },
    { path: '/123/portfolio-peril', testId: 'set-portfolio-peril' },
    { path: '/123/portfolio-region', testId: 'set-portfolio-region' },
    { path: '/123/treaties', testId: 'select-treaties' },
    { path: '/123/treaty-peril', testId: 'set-treaty-peril' },
    { path: '/123/treaty-region', testId: 'set-treaty-region' },
    { path: '/123/link-portfolios', testId: 'link-portfolios' },
    { path: '/123/review', testId: 'review-finalize' },
  ];

  routes.forEach(({ path, testId }) => {
    test(`renders ${testId} at ${path}`, () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      );
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  test('renders NotFound for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown/route/path']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });
});
