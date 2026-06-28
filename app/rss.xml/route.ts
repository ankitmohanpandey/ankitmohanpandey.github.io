import { getAllBlogPosts } from '@/lib/blog';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllBlogPosts();

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ankit Mohan Pandey - Blog</title>
    <description>Senior Data Engineer specializing in GCP, Apache Beam, Airflow, and BigQuery</description>
    <link>https://ankitmohanpandey.in</link>
    <atom:link href="https://ankitmohanpandey.in/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map((post) => `
    <item>
      <title>${post.frontmatter.title}</title>
      <description>${post.frontmatter.description}</description>
      <link>https://ankitmohanpandey.in/blog/${post.slug}</link>
      <guid>https://ankitmohanpandey.in/blog/${post.slug}</guid>
      <pubDate>${new Date(post.frontmatter.publishedDate).toUTCString()}</pubDate>
      <author>Ankit Mohan Pandey</author>
      <category>${post.frontmatter.categories.join(', ')}</category>
      ${post.frontmatter.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
