import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAllBlogPosts } from '@/lib/blog';
import { PostCard } from '@/components/blog/PostCard';
import Link from 'next/link';

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Ankit Mohan Pandey
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Senior Data Engineer specializing in GCP, Apache Beam, Airflow, and BigQuery
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Read Blog
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
            >
              About Me
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {posts.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all posts →
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
