import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { publishToAllPlatforms } from '../lib/publishers';
import { BlogFrontmatter } from '../lib/types/blog';

const contentDirectory = path.join(process.cwd(), 'content/blog');

async function publishWorkflow() {
  console.log('🚀 Starting publish workflow...\n');

  if (!fs.existsSync(contentDirectory)) {
    console.log('No content/blog directory found');
    console.log('✅ Publish workflow completed (no posts to publish)');
    return;
  }

  // Get all published posts
  const fileNames = fs.readdirSync(contentDirectory);
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith('.mdx'));

  if (mdxFiles.length === 0) {
    console.log('No MDX files found in content/blog directory');
    console.log('✅ Publish workflow completed (no posts to publish)');
    return;
  }

  for (const fileName of mdxFiles) {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as BlogFrontmatter;

    if (frontmatter.draft) {
      console.log(`⏭️  Skipping draft: ${slug}`);
      continue;
    }

    console.log(`\n📝 Publishing: ${frontmatter.title}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Tags: ${frontmatter.tags.join(', ')}`);

    const post = {
      slug,
      frontmatter,
      content,
    };

    // Publish to all platforms
    const results = await publishToAllPlatforms(post);

    console.log('\n📊 Publish Results:');
    results.forEach((result) => {
      if (result.success) {
        console.log(`   ✅ ${result.platform}: ${result.url || 'Success'}`);
      } else {
        console.log(`   ❌ ${result.platform}: ${result.error}`);
      }
    });
  }

  console.log('\n✅ Publish workflow completed!');
}

publishWorkflow().catch(console.error);
