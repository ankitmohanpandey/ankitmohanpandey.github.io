import type { Metadata } from 'next';
import { Shell, Container } from '@/components/Shell';
import { PostCard } from '@/components/blog/PostCard';
import { Subscribe } from '@/components/Subscribe';
import { getAllPosts, getTagCounts } from '@/lib/content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Essays and notes on streaming systems, data platforms, and making pipelines reliable.',
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getTagCounts()]);

  return (
    <Shell>
      <Container className="py-16 sm:py-20">
        <header className="border-b border-line pb-8">
          <div className="eyebrow">writing</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-bright">
            Notes from the pipeline
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Long-form posts written here, plus newsletter issues mirrored from
            Substack. {posts.length} {posts.length === 1 ? 'post' : 'posts'} so far.
          </p>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] text-dim">
              {tags.slice(0, 12).map(({ tag, count }) => (
                <span key={tag}>
                  #{tag}
                  <span className="ml-1 text-line-strong">{count}</span>
                </span>
              ))}
            </div>
          )}
        </header>

        {posts.length === 0 ? (
          <p className="py-16 font-mono text-sm text-dim">
            No posts yet. The Substack mirror will fill this in as soon as
            there&apos;s something published.
          </p>
        ) : (
          <div className="mt-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <div className="mt-16">
          <Subscribe />
        </div>
      </Container>
    </Shell>
  );
}
