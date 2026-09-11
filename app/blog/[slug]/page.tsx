import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Shell, Container } from '@/components/Shell';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CodeBlock } from '@/components/blog/CodeBlock';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { Byline } from '@/components/blog/Byline';
import { Tldr } from '@/components/blog/Tldr';
import { FaqSection } from '@/components/blog/FaqSection';
import { getPostBySlug, getRelatedPosts, getAdjacentPosts, getAllPosts } from '@/lib/content';
import { formatDate, slugify } from '@/lib/utils';
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
  const images = frontmatter.coverImage ? [frontmatter.coverImage] : ['/opengraph-image'];

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

  const primaryCategory = frontmatter.categories[0];

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

  const faqJsonLd = frontmatter.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: frontmatter.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
        />
      )}

      <Container className="py-16">
        <article>
          <header className="max-w-3xl border-b border-line pb-10">
            <Breadcrumb
              topic={
                primaryCategory
                  ? { label: primaryCategory, slug: slugify(primaryCategory) }
                  : undefined
              }
            />

            <h1 className="editorial-title mt-6 text-balance text-4xl leading-[1.12] text-bright sm:text-6xl">
              {frontmatter.title}
            </h1>

            {frontmatter.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {frontmatter.description}
              </p>
            )}

            <div className="mt-5">
              <Byline
                author={frontmatter.author}
                publishedDate={frontmatter.publishedDate}
                readingTime={post.readingTime}
                category={primaryCategory}
              />
            </div>

            {(frontmatter.updatedDate || post.source === 'substack' || post.externalUrl) && (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-dim">
                {frontmatter.updatedDate && (
                  <time dateTime={frontmatter.updatedDate}>
                    last updated {formatDate(frontmatter.updatedDate)}
                  </time>
                )}
                {post.source === 'substack' && (
                  <span className="text-signal">from the newsletter</span>
                )}
                {post.externalUrl && (
                  <a
                    href={post.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-signal"
                  >
                    originally published on substack ↗
                  </a>
                )}
              </div>
            )}
          </header>

          <div className="mt-10 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="mx-auto w-full max-w-3xl">
              {frontmatter.summary && (
                <div className="mb-10">
                  <Tldr summary={frontmatter.summary} />
                </div>
              )}

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

              {frontmatter.faq && <FaqSection items={frontmatter.faq} />}

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
