import { getAllBlogPosts } from '../lib/blog';

async function pingGoogleIndexing() {
  const apiKey = process.env.GOOGLE_INDEXING_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  Google Indexing API key not configured. Skipping.');
    return;
  }

  const posts = getAllBlogPosts();
  const baseUrl = 'https://ankitmohanpandey.in';

  console.log('🔔 Pinging Google Indexing API...');

  for (const post of posts) {
    const url = `${baseUrl}/blog/${post.slug}`;
    
    try {
      const response = await fetch(
        `https://indexing.googleapis.com/v3/urlNotifications:publish?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            type: 'URL_UPDATED',
          }),
        }
      );

      if (response.ok) {
        console.log(`✅ Indexed: ${url}`);
      } else {
        console.log(`❌ Failed to index: ${url}`);
      }
    } catch (error) {
      console.error(`Error indexing ${url}:`, error);
    }
  }

  console.log('\n✅ Google Indexing ping completed!');
}

pingGoogleIndexing().catch(console.error);
