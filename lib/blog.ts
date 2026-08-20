import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types/blog';
import { validateBlogFrontmatter } from './validators/blog';
import { calculateReadingTime } from './utils';

const contentDirectory = path.join(process.cwd(), 'content/blog');

function readPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx$/, '');
  const fileContents = fs.readFileSync(path.join(contentDirectory, fileName), 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: validateBlogFrontmatter(data),
    content,
    readingTime: calculateReadingTime(content),
    source: 'local',
  };
}

/** Posts authored as MDX in this repo, newest first, drafts excluded. */
export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs
    .readdirSync(contentDirectory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map(readPost)
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedDate).getTime() -
        new Date(a.frontmatter.publishedDate).getTime()
    );
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    return readPost(`${slug}.mdx`);
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}
