import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types/blog';
import { validateBlogFrontmatter } from './validators/blog';
import { calculateReadingTime } from './utils';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const frontmatter = validateBlogFrontmatter(data);
      const readingTime = calculateReadingTime(content);

      return {
        slug,
        frontmatter,
        content,
        readingTime,
      };
    })
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.publishedDate);
      const dateB = new Date(b.frontmatter.publishedDate);
      return dateB.getTime() - dateA.getTime();
    });

  return allPostsData;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = validateBlogFrontmatter(data);
    const readingTime = calculateReadingTime(content);

    return {
      slug,
      frontmatter,
      content,
      readingTime,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const allPosts = getAllBlogPosts();
  const currentPost = getBlogPostBySlug(currentSlug);

  if (!currentPost) {
    return [];
  }

  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => {
      const hasMatchingTag = post.frontmatter.tags.some((tag) =>
        currentPost.frontmatter.tags.includes(tag)
      );
      const hasMatchingCategory = post.frontmatter.categories.some((category) =>
        currentPost.frontmatter.categories.includes(category)
      );
      return hasMatchingTag || hasMatchingCategory;
    })
    .slice(0, limit);

  return relatedPosts;
}

export function getPreviousAndNextPost(currentSlug: string): {
  previous: BlogPost | null;
  next: BlogPost | null;
} {
  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}
