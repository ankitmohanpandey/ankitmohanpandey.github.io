import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Shell, Container } from '@/components/Shell';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CodeBlock } from '@/components/blog/CodeBlock';
import { getPostBySlug, getRelatedPosts, getAdjacentPosts, getAllPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import { extractHeadings } from '@/lib/headings';
import { site } from '@/lib/site';

export const revalidate = 3600;

const components = { pre: CodeBlock };

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Post not found' };

  const { frontmatter } = post;
  const images = frontmatter.coverImage ? [frontmatter.coverImage] : ['/og-image.png'];

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    // Syndicated posts point back at Substack so search engines credit the original.
    alternates: { canonical: frontmatter.canonicalUrl ?? `/blog/${post.slug}` },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${site.url}/blog/${post.slug}`,
      type: 'article',
      publishedTime: frontmatter.publishedDate,
      modifiedTime: frontmatter.updatedDate,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [related, { previous, next }] = await Promise.all([
    getRelatedPosts(slug),
    getAdjacentPosts(slug),
  ]);

  const { frontmatter } = post;
  // Syndicated HTML has no stable heading ids, so the outline is MDX-only.
  const headings = post.source === 'local' ? extractHeadings(post.content) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedDate,
    dateModified: frontmatter.updatedDate ?? frontmatter.publishedDate,
    author: { '@type': 'Person', name: frontmatter.author, url: site.url },
    keywords: frontmatter.tags.join(', '),
    mainEntityOfPage: frontmatter.canonicalUrl ?? `${site.url}/blog/${post.slug}`,
  };

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-16">
        <article>
          <header className="mx-auto max-w-3xl border-b border-line pb-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-dim">
              <time dateTime={frontmatter.publishedDate}>
                {formatDate(frontmatter.publishedDate)}
              </time>
              <span className="text-line-strong">/</span>
              <span>{post.readingTime} min read</span>
              {post.source === 'substack' && (
                <>
                  <span className="text-line-strong">/</span>
                  <span className="text-signal">from the newsletter</span>
                </>
              )}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-bright sm:text-4xl">
              {frontmatter.title}
            </h1>

            {frontmatter.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {frontmatter.description}
              </p>
            )}

            {post.externalUrl && (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-block font-mono text-xs text-dim transition-colors hover:text-signal"
              >
                originally published on substack ↗
              </a>
            )}
          </header>

          <div className="mt-10 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="mx-auto w-full max-w-3xl">
              <div className="article">
                {post.source === 'substack' && post.html ? (
                  <div dangerouslySetInnerHTML={{ __html: post.html }} />
                ) : (
                  <MDXRemote source={post.content} components={components} />
                )}
              </div>

              {frontmatter.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-line bg-raised px-2 py-1 font-mono text-[11px] text-dim"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <PostNavigation previous={previous} next={next} />
              <RelatedPosts posts={related} />
            </div>

            <aside className="hidden lg:block">
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </article>
      </Container>
    </Shell>
  );
}
