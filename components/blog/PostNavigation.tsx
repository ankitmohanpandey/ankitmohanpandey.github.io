import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';

interface PostNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
      {previous && (
        <Link
          href={`/blog/${previous.slug}`}
          className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/80"
        >
          <div className="text-sm text-gray-400">← Previous</div>
          <h3 className="mt-2 font-semibold text-white">
            {previous.frontmatter.title}
          </h3>
        </Link>
      )}
      {next && (
        <Link
          href={`/blog/${next.slug}`}
          className={`rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/80 ${
            !previous ? 'md:col-start-2' : ''
          }`}
        >
          <div className="text-sm text-gray-400">Next →</div>
          <h3 className="mt-2 font-semibold text-white">
            {next.frontmatter.title}
          </h3>
        </Link>
      )}
    </div>
  );
}
