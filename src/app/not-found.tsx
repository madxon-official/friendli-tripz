import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center py-20">
      <Container>
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-brand-border/60 shadow-card space-y-4">
          <span className="text-4xl font-extrabold text-brand-orange font-heading">404</span>
          <h1 className="text-2xl font-bold text-brand-navy font-heading">Page Not Found</h1>
          <p className="text-sm text-brand-muted">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-2">
            <Button href={ROUTES.HOME} variant="primary" size="md" className="w-full justify-center">
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
