import { BlogFrontmatter } from '../types/blog';

export function validateBlogFrontmatter(frontmatter: Record<string, unknown>): BlogFrontmatter {
  const errors: string[] = [];

  if (!frontmatter.title || typeof frontmatter.title !== 'string') {
    errors.push('Title is required and must be a string');
  }

  if (!frontmatter.description || typeof frontmatter.description !== 'string') {
    errors.push('Description is required and must be a string');
  }

  if (!frontmatter.tags || !Array.isArray(frontmatter.tags)) {
    errors.push('Tags is required and must be an array');
  }

  if (!frontmatter.categories || !Array.isArray(frontmatter.categories)) {
    errors.push('Categories is required and must be an array');
  }

  if (!frontmatter.author || typeof frontmatter.author !== 'string') {
    errors.push('Author is required and must be a string');
  }

  if (!frontmatter.publishedDate || typeof frontmatter.publishedDate !== 'string') {
    errors.push('Published date is required and must be a string');
  }

  // Validate date format
  if (frontmatter.publishedDate) {
    const date = new Date(frontmatter.publishedDate as string);
    if (isNaN(date.getTime())) {
      errors.push('Published date must be a valid ISO date string');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Blog frontmatter validation failed:\n${errors.join('\n')}`);
  }

  return frontmatter as unknown as BlogFrontmatter;
}
