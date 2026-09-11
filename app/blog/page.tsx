import type { Metadata } from 'next';
import Link from 'next/link';
import { Shell, Container } from '@/components/Shell';
import { PostCard } from '@/components/blog/PostCard';
import { Byline } from '@/components/blog/Byline';
import { Subscribe } from '@/components/Subscribe';
import { getAllPosts } from '@/lib/content';
import { site } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Ideas, practical lessons, and discoveries across data engineering and technology.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const [latest, ...archive] = posts;

  return (
    <Shell>
      <Container className="py-16 sm:py-24">
        <header className="journal-header">
          <div>
            <div className="eyebrow">The journal / by Ankit Mohan Pandey</div>
            <h1 className="editorial-title mt-5 text-balance text-5xl leading-[1.08] text-bright sm:text-7xl">
              Good ideas.<br /><span className="italic text-signal">Worth sharing.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Things I&apos;m building, questions I&apos;m exploring, and useful discoveries
              across technology. Written to understand. Shared to help.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 self-end">
            <Link href="/blog/topics" className="action-secondary">Browse topics</Link>
            <a href="/rss.xml" className="action-secondary">RSS feed <span aria-hidden="true">↗</span></a>
          </div>
        </header>

        {latest ? (
          <div className="journal-layout">
            <div className="min-w-0">
              <article className="featured-story">
                <div className="eyebrow text-signal">Latest story</div>
                <h2 className="editorial-title mt-5 text-balance text-3xl leading-tight text-bright sm:text-4xl">
                  <Link href={`/blog/${latest.slug}`} className="transition-colors hover:text-signal">
                    {latest.frontmatter.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{latest.frontmatter.description}</p>
                <div className="mt-6">
                  <Byline author={latest.frontmatter.author} publishedDate={latest.frontmatter.publishedDate}
                    readingTime={latest.readingTime} category={latest.frontmatter.categories[0]} />
                </div>
                <Link href={`/blog/${latest.slug}`} className="mt-8 inline-flex items-center gap-4 text-sm font-medium text-signal">
                  Read the story <span aria-hidden="true">→</span>
                </Link>
              </article>
              {archive.length > 0 && (
                <section className="mt-12" aria-labelledby="more-writing">
                  <h2 id="more-writing" className="eyebrow border-b border-line pb-4">More to explore</h2>
                  {archive.map((post) => <PostCard key={post.slug} post={post} />)}
                </section>
              )}
            </div>
            <aside className="journal-aside">
              <div className="eyebrow">A little context</div>
              <h2 className="editorial-title mt-4 text-2xl text-bright">An engineer.<br />Always a student.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                I&apos;m {site.name}, a data engineer who enjoys getting to the bottom of how things work.
                This is where I share the process, not just the polished answers.
              </p>
              <Link href="/about" className="mt-5 inline-block text-sm text-signal">More about me →</Link>
              <div className="mt-8 border-t border-line pt-6">
                <div className="eyebrow">One place to write</div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Public Substack essays are also available here. Follow the newsletter to receive new writing in your inbox.
                </p>
                <a href={site.socials.substack} target="_blank" rel="noreferrer noopener"
                  className="mt-4 inline-block text-sm text-signal">Find me on Substack ↗</a>
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-16">
            <h2 className="editorial-title text-3xl text-bright">Something worth sharing is on its way.</h2>
            <p className="mt-3 text-muted">Explore the newsletter while new writing arrives here.</p>
            <a href={site.socials.substack} className="action-secondary mt-6">Visit Substack ↗</a>
          </div>
        )}
        <div className="mt-20"><Subscribe /></div>
      </Container>
    </Shell>
  );
}
