import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-12 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">Related Posts</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-gray-700 hover:bg-gray-900/80"
          >
            <h4 className="font-medium text-white">{post.frontmatter.title}</h4>
            <p className="mt-2 line-clamp-2 text-sm text-gray-400">
              {post.frontmatter.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
