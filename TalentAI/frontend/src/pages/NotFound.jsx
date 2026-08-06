import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="gradient-text text-7xl font-bold">404</h1>
      <p className="text-text-muted">This page drifted off somewhere.</p>
      <Link to="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
