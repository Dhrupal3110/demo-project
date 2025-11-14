import { Routes, Route } from 'react-router-dom';
import CRMSearchUI from '@/pages/SearchProgram';
import SidebarStepper from '@/pages/SidebarStepper';
import NotFound from '@/pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CRMSearchUI />} />
      <Route path="/stepper" element={<SidebarStepper />} />

      {/* Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
