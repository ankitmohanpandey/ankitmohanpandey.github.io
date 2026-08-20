import Link from 'next/link';
import { Shell, Container } from '@/components/Shell';

export default function NotFound() {
  return (
    <Shell>
      <Container className="flex min-h-[60vh] flex-col justify-center py-20">
        <div className="font-mono text-sm text-signal">404</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-bright">
          No route to that record
        </h1>
        <p className="mt-4 max-w-md text-muted">
          This page either moved or never existed. Nothing was dropped on the
          floor — it just is not here.
        </p>
        <div className="mt-8 flex gap-4 font-mono text-sm">
          <Link href="/" className="text-fg transition-colors hover:text-signal">
            ← home
          </Link>
          <Link href="/blog" className="text-dim transition-colors hover:text-signal">
            writing
          </Link>
        </div>
      </Container>
    </Shell>
  );
}
