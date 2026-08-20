import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';
import { cn } from '@/lib/utils';

interface PostNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav className="mt-12 grid gap-3 sm:grid-cols-2">
      {previous && (
        <Link
          href={`/blog/${previous.slug}`}
          className="group rounded-lg border border-line bg-surface/40 p-5 transition-colors hover:border-line-strong"
        >
          <div className="font-mono text-[11px] text-dim">← newer</div>
          <div className="mt-2 font-medium text-fg transition-colors group-hover:text-signal">
            {previous.frontmatter.title}
          </div>
        </Link>
      )}

      {next && (
        <Link
          href={`/blog/${next.slug}`}
          className={cn(
            'group rounded-lg border border-line bg-surface/40 p-5 transition-colors hover:border-line-strong',
            !previous && 'sm:col-start-2',
            'sm:text-right'
          )}
        >
          <div className="font-mono text-[11px] text-dim">older →</div>
          <div className="mt-2 font-medium text-fg transition-colors group-hover:text-signal">
            {next.frontmatter.title}
          </div>
        </Link>
      )}
    </nav>
  );
}
