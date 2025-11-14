import AppRoutes from '@/routes/AppRoutes';
import { Footer } from './components/common';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col text-(--color-text) ">
      {/* Main content grows */}
      <main className="flex-1 ">
        <AppRoutes />
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}