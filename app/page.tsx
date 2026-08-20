import Link from 'next/link';
import { Shell, Container, SectionHeading } from '@/components/Shell';
import { Hero } from '@/components/home/Hero';
import { Capabilities } from '@/components/home/Capabilities';
import { Work } from '@/components/home/Work';
import { Subscribe } from '@/components/Subscribe';
import { PostCard } from '@/components/blog/PostCard';
import { getAllPosts } from '@/lib/content';

/** Rebuild hourly so newly published Substack essays appear without a deploy. */
export const revalidate = 3600;

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 4);

  return (
    <Shell>
      <Hero />

      <Container className="py-20">
        <SectionHeading eyebrow="what I do" title="Areas I go deep on" />
        <Capabilities />
      </Container>

      <Container className="py-8">
        <SectionHeading eyebrow="selected work" title="Things I've built" />
        <Work />
      </Container>

      <Container className="py-20">
        <SectionHeading
          eyebrow="writing"
          title="Latest posts"
          action={
            <Link
              href="/blog"
              className="shrink-0 font-mono text-sm text-dim transition-colors hover:text-signal"
            >
              all posts →
            </Link>
          }
        />

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-dim">
            Nothing published yet — check back soon.
          </p>
        ) : (
          <div className="border-t border-line">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </Container>

      <Container className="pb-8">
        <Subscribe />
      </Container>
    </Shell>
  );
}
