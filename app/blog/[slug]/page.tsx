import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getBlogPostBySlug, getRelatedPosts, getPreviousAndNextPost } from '@/lib/blog';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CodeBlock } from '@/components/blog/CodeBlock';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

const components = {
  pre: CodeBlock,
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.frontmatter.title} - Ankit Mohan Pandey`,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `https://ankitmohanpandey.in/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.frontmatter.publishedDate,
      modifiedTime: post.frontmatter.updatedDate,
      authors: [post.frontmatter.author],
      images: post.frontmatter.coverImage
        ? [{ url: post.frontmatter.coverImage, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: post.frontmatter.coverImage ? [post.frontmatter.coverImage] : [],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug);
  const { previous, next } = getPreviousAndNextPost(params.slug);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span>{formatDate(post.frontmatter.publishedDate)}</span>
                <span>·</span>
                <span>{post.readingTime} min read</span>
                <span>·</span>
                <span>{post.frontmatter.author}</span>
              </div>
              {post.frontmatter.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.frontmatter.coverImage}
                  alt={post.frontmatter.title}
                  className="mt-6 rounded-lg w-full"
                />
              )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="prose prose-invert max-w-none">
                  <MDXRemote source={post.content} components={components} />
                </div>
              </div>
              
              <div className="hidden lg:block">
                <TableOfContents content={post.content} />
              </div>
            </div>

            <PostNavigation previous={previous} next={next} />
            <RelatedPosts posts={relatedPosts} />
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
