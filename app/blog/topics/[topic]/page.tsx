import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Shell, Container } from '@/components/Shell';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { PostCard } from '@/components/blog/PostCard';
import { getTopics, getPostsByTopic } from '@/lib/content';

export const revalidate = 3600;

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((entry) => entry.slug === slug);

  if (!topic) return { title: 'Topic not found' };

  return {
    title: topic.topic,
    description: `Posts filed under ${topic.topic}.`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: slug } = await params;
  const [topics, posts] = await Promise.all([getTopics(), getPostsByTopic(slug)]);
  const topic = topics.find((entry) => entry.slug === slug);

  if (!topic) notFound();

  return (
    <Shell>
      <Container className="py-16 sm:py-20">
        <header className="border-b border-line pb-8">
          <Breadcrumb topic={{ label: topic.topic, slug: topic.slug }} />
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-bright">
            {topic.topic}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} filed under this topic.
          </p>
        </header>

        <div className="mt-8 border-t border-line">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </Shell>
  );
}
