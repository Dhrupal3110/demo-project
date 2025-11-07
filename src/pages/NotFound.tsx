import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <Link to="/" className="mt-6 text-blue-500 hover:underline">
        Go Home
      </Link>
    </div>
  );
}
