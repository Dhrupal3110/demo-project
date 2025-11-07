import { Routes, Route } from 'react-router-dom';
import CRMSearchUI from '../pages/SearchProgram';
import SidebarStepper from '../pages/SidebarStepper';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CRMSearchUI />} />
      <Route path="/stepper" element={<SidebarStepper />} />
    </Routes>
  );
}
