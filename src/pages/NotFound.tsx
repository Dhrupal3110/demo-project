import { Header } from '@/features/searchProgram';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-54px)]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
        <h1 className="text-4xl font-bold text-(--color-error)">
          404 - Page Not Found
        </h1>
        <Link to="/" className="mt-6 text-(--color-info) hover:underline">
          Go Home
        </Link>
      </div>
    </div>
  );
}
