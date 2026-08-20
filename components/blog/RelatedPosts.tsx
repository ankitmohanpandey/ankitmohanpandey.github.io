import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';
import { formatDate } from '@/lib/utils';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="eyebrow border-b border-line pb-3">keep reading</div>

      <div className="divide-y divide-line">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-4"
          >
            <div className="font-mono text-[11px] text-dim">
              {formatDate(post.frontmatter.publishedDate)}
            </div>
            <div className="mt-1 font-medium text-fg transition-colors group-hover:text-signal">
              {post.frontmatter.title}
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-muted">
              {post.frontmatter.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
