import Link from 'next/link';
import Image from 'next/image';
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
  const primaryCategory = frontmatter.categories[0];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-sm border-b border-line py-8 transition-colors hover:bg-surface/40"
    >
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-dim">
            <time dateTime={frontmatter.publishedDate}>
              {formatDate(frontmatter.publishedDate)}
            </time>
            <span className="text-line-strong">/</span>
            <span>{post.readingTime} min</span>
            {primaryCategory && (
              <>
                <span className="text-line-strong">/</span>
                <span className="rounded border border-line bg-raised px-1.5 py-0.5 text-[10px] text-dim">
                  {primaryCategory}
                </span>
              </>
            )}
            {post.source === 'substack' && (
              <>
                <span className="text-line-strong">/</span>
                <span className="text-signal">newsletter</span>
              </>
            )}
          </div>

          <h3 className="mt-3 text-2xl font-medium leading-snug tracking-tight text-fg transition-colors group-hover:text-signal">
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
        </div>

        {frontmatter.coverImage && (
          <Image
            src={frontmatter.coverImage}
            alt=""
            width={160}
            height={96}
            className="hidden size-24 shrink-0 rounded-lg border border-line object-cover sm:block"
          />
        )}
      </div>
    </Link>
  );
}
