import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: BlogPost;
}

/**
 * Dense list row rather than a card grid — titles and dates scan much faster
 * for a text-heavy engineering blog.
 */
export function PostCard({ post }: PostCardProps) {
  const { frontmatter } = post;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-b border-line py-6 transition-colors"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-dim">
        <time dateTime={frontmatter.publishedDate}>
          {formatDate(frontmatter.publishedDate)}
        </time>
        <span className="text-line-strong">/</span>
        <span>{post.readingTime} min</span>
        {post.source === 'substack' && (
          <>
            <span className="text-line-strong">/</span>
            <span className="text-signal">newsletter</span>
          </>
        )}
      </div>

      <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg transition-colors group-hover:text-signal">
        {frontmatter.title}
      </h3>

      <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted">
        {frontmatter.description}
      </p>

      {frontmatter.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 font-mono text-[11px] text-dim">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
