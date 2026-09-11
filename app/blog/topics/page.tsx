import type { Metadata } from 'next';
import Link from 'next/link';
import { Shell, Container } from '@/components/Shell';
import { getTopics } from '@/lib/content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Browse posts by topic — streaming, warehousing, learning notes and more.',
};

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <Shell>
      <Container className="py-16 sm:py-20">
        <header className="border-b border-line pb-8">
          <div className="eyebrow">writing</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-bright">Topics</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Every post, grouped by the broad area it belongs to.
          </p>
        </header>

        {topics.length === 0 ? (
          <p className="py-16 font-mono text-sm text-dim">Nothing to group yet.</p>
        ) : (
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/blog/topics/${topic.slug}`}
                className="group flex items-baseline justify-between gap-4 bg-base p-6 transition-colors hover:bg-surface"
              >
                <span className="text-lg font-semibold text-bright transition-colors group-hover:text-signal">
                  {topic.topic}
                </span>
                <span className="font-mono text-xs text-dim">
                  {topic.count} {topic.count === 1 ? 'post' : 'posts'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Shell>
  );
}
