import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/80"
    >
      {post.frontmatter.coverImage && (
        <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.frontmatter.coverImage}
            alt={post.frontmatter.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{formatDate(post.frontmatter.publishedDate)}</span>
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>

      <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-gray-200">
        {post.frontmatter.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-gray-400">
        {post.frontmatter.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.frontmatter.tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
