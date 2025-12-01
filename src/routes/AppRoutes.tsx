import { Routes, Route, Navigate } from 'react-router-dom';
import SelectProgram from '@/pages/SelectProgram';
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
  StepWrapper,
} from '@/features/sidebarStepper';

import SubmissionSuccess from '@/pages/SubmissionSuccess';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SelectProgram />} />
      <Route path="/:programId/success" element={<SubmissionSuccess />} />
      <Route path="/:programId" element={<MainLayout />}>
        <Route index element={<Navigate to="database" replace />} />
        <Route
          path="database"
          element={<StepWrapper step={2} component={SelectDatabases} />}
        />
        <Route
          path="portfolio"
          element={<StepWrapper step={3} component={SelectPortfolios} />}
        />
        <Route
          path="demand-surge"
          element={<StepWrapper step={4} component={SetDemandSurge} />}
        />
        <Route
          path="portfolio-peril"
          element={
            <StepWrapper step={5} component={SetPortfolioPerilCoverage} />
          }
        />
        <Route
          path="portfolio-region"
          element={
            <StepWrapper step={6} component={SetPortfolioRegionCoverage} />
          }
        />
        <Route
          path="treaties"
          element={<StepWrapper step={7} component={SelectTreaties} />}
        />
        <Route
          path="treaty-peril"
          element={
            <StepWrapper step={8} component={SetTreatyPerilCoverage} />
          }
        />
        <Route
          path="treaty-region"
          element={
            <StepWrapper step={9} component={SetTreatyRegionCoverage} />
          }
        />
        <Route
          path="link-portfolios"
          element={
            <StepWrapper step={10} component={LinkPortfoliosAndTreaties} />
          }
        />
        <Route
          path="review"
          element={<StepWrapper step={11} component={ReviewAndFinalize} />}
        />
      </Route>

      {/* Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
