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
} from '@/features/sidebarStepper';

import SubmissionSuccess from '@/pages/SubmissionSuccess';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SelectProgram />} />
      <Route path="/:programId/success" element={<SubmissionSuccess />} />
      <Route path="/:programId" element={<MainLayout />}>
        <Route index element={<Navigate to="database" replace />} />
        <Route path="database" element={<SelectDatabases />} />
        <Route path="portfolio" element={<SelectPortfolios />} />
        <Route path="demand-surge" element={<SetDemandSurge />} />
        <Route path="portfolio-peril" element={<SetPortfolioPerilCoverage />} />
        <Route
          path="portfolio-region"
          element={<SetPortfolioRegionCoverage />}
        />
        <Route path="treaties" element={<SelectTreaties />} />
        <Route path="treaty-peril" element={<SetTreatyPerilCoverage />} />
        <Route path="treaty-region" element={<SetTreatyRegionCoverage />} />
        <Route
          path="link-portfolios"
          element={<LinkPortfoliosAndTreaties />}
        />
        <Route path="review" element={<ReviewAndFinalize />} />
      </Route>

      {/* Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
