import { Routes, Route, Navigate } from 'react-router-dom';
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import SelectProgram from '@/pages/SelectProgram';
import { ErrorBoundary } from '@/components/common';
import MainLayout from '@/layouts/MainLayout';
import NotFound from '@/pages/NotFound';
import {
  SelectDatabases,
  SelectPortfolios,
  SetDemandSurge,
  SetPortfolioPerilCoverage,
  SetPortfolioRegionCoverage,
  SelectTreaties,
  SetTreatyPerilCoverage,
  SetTreatyRegionCoverage,
  LinkPortfoliosAndTreaties,
  ReviewAndFinalize,
} from '@/features/sidebarStepper';



import { getEnv } from '@/utils/envWrapper';

export default function AppRoutes() {
  const bypassAuth = getEnv('VITE_BYPASS_AUTH') === 'true';

  const Content = (
    <Routes>
      <Route path="/" element={<SelectProgram />} />
      <Route path="/:programId" element={<MainLayout />}>
        <Route index element={<Navigate to="database" replace />} />
        <Route
          path="database"
          element={
            <ErrorBoundary>
              <SelectDatabases />
            </ErrorBoundary>
          }
        />
        <Route
          path="portfolio"
          element={
            <ErrorBoundary>
              <SelectPortfolios />
            </ErrorBoundary>
          }
        />
        <Route
          path="demand-surge"
          element={
            <ErrorBoundary>
              <SetDemandSurge />
            </ErrorBoundary>
          }
        />
        <Route
          path="portfolio-peril"
          element={
            <ErrorBoundary>
              <SetPortfolioPerilCoverage />
            </ErrorBoundary>
          }
        />
        <Route
          path="portfolio-region"
          element={
            <ErrorBoundary>
              <SetPortfolioRegionCoverage />
            </ErrorBoundary>
          }
        />
        <Route
          path="treaties"
          element={
            <ErrorBoundary>
              <SelectTreaties />
            </ErrorBoundary>
          }
        />
        <Route
          path="treaty-peril"
          element={
            <ErrorBoundary>
              <SetTreatyPerilCoverage />
            </ErrorBoundary>
          }
        />
        <Route
          path="treaty-region"
          element={
            <ErrorBoundary>
              <SetTreatyRegionCoverage />
            </ErrorBoundary>
          }
        />
        <Route
          path="link-portfolios"
          element={
            <ErrorBoundary>
              <LinkPortfoliosAndTreaties />
            </ErrorBoundary>
          }
        />
        <Route
          path="review"
          element={
            <ErrorBoundary>
              <ReviewAndFinalize />
            </ErrorBoundary>
          }
        />
      </Route>

      {/* Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (bypassAuth) {
    return Content;
  }

  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      {Content}
    </MsalAuthenticationTemplate>
  );
}
