import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main" className={cn('flex-1', className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

/** Standard content column. Every page uses this so gutters stay consistent. */
export function Container({ children, className }: ShellProps) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl px-6', className)}>{children}</div>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-4">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-bright">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
