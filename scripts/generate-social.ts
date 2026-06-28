import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogFrontmatter } from '../lib/types/blog';

const contentDirectory = path.join(process.cwd(), 'content/blog');
const socialDirectory = path.join(process.cwd(), 'social');

function generateLinkedInPost(frontmatter: BlogFrontmatter, slug: string): string {
  const hook = `🚀 ${frontmatter.title}`;
  const summary = frontmatter.description;
  const tags = frontmatter.tags.slice(0, 3).join(', ');
  const url = `https://ankitmohanpandey.in/blog/${slug}`;

  return `# ${hook}

${summary}

## Key Takeaways:
• ${frontmatter.categories[0] || 'Technology'}
• ${tags}
• ${frontmatter.readingTime || '5'} min read

🔗 Read the full article: ${url}

#DataEngineering #Tech #${frontmatter.tags[0] || 'Technology'}

---
Generated automatically for ${frontmatter.title}
`;
}

function generateTwitterThread(frontmatter: BlogFrontmatter, slug: string): string {
  const url = `https://ankitmohanpandey.in/blog/${slug}`;
  const tweets: string[] = [];

  // Tweet 1: Hook
  tweets.push(`🧵 ${frontmatter.title}\n\n${frontmatter.description.substring(0, 100)}...`);

  // Tweet 2: Summary
  tweets.push(`In this article, I cover:\n\n• ${frontmatter.categories.join('\n• ')}\n\n${frontmatter.tags.slice(0, 2).map(t => `#${t.replace(/\s/g, '')}`).join(' ')}`);

  // Tweet 3: Key points (simulated)
  tweets.push(`Key insights:\n\n1. ${frontmatter.description.substring(0, 80)}...\n2. Practical examples\n3. Best practices\n\n👇`);

  // Tweet 4: Reading time
  tweets.push(`Time to read: ${frontmatter.readingTime || '5'} minutes\n\nPerfect for your morning coffee ☕`);

  // Tweet 5: CTA
  tweets.push(`Read the full article here:\n\n${url}\n\n🔔 Follow for more content on ${frontmatter.tags[0] || 'tech'}`);

  return tweets.join('\n\n---\n\n');
}

function generateSocialPosts() {
  if (!fs.existsSync(contentDirectory)) {
    console.log('No content directory found');
    return;
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith('.mdx'));

  // Create social directories
  fs.mkdirSync(path.join(socialDirectory, 'linkedin'), { recursive: true });
  fs.mkdirSync(path.join(socialDirectory, 'twitter'), { recursive: true });

  mdxFiles.forEach((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    const frontmatter = data as BlogFrontmatter;

    // Generate LinkedIn post
    const linkedinContent = generateLinkedInPost(frontmatter, slug);
    const linkedinPath = path.join(socialDirectory, 'linkedin', `${slug}.md`);
    fs.writeFileSync(linkedinPath, linkedinContent);
    console.log(`✓ Generated LinkedIn post: ${linkedinPath}`);

    // Generate Twitter thread
    const twitterContent = generateTwitterThread(frontmatter, slug);
    const twitterPath = path.join(socialDirectory, 'twitter', `${slug}.md`);
    fs.writeFileSync(twitterPath, twitterContent);
    console.log(`✓ Generated Twitter thread: ${twitterPath}`);
  });

  console.log('\n✅ Social posts generated successfully!');
}

generateSocialPosts();
