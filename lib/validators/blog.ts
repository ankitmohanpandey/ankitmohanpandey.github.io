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

  // Optional cover image — must be a string when present.
  if (frontmatter.coverImage !== undefined && typeof frontmatter.coverImage !== 'string') {
    errors.push('Cover image must be a string when set');
  }

  // Optional last-updated date — must be a valid ISO date string when present.
  if (frontmatter.updatedDate !== undefined && typeof frontmatter.updatedDate !== 'string') {
    errors.push('Updated date must be a string when set');
  } else if (frontmatter.updatedDate) {
    const date = new Date(frontmatter.updatedDate as string);
    if (isNaN(date.getTime())) {
      errors.push('Updated date must be a valid ISO date string');
    }
  }

  // Optional TL;DR — must be a string when present.
  if (frontmatter.summary !== undefined && typeof frontmatter.summary !== 'string') {
    errors.push('Summary must be a string when set');
  }

  // Optional FAQ — an array of { question, answer } strings when present.
  if (frontmatter.faq !== undefined) {
    if (!Array.isArray(frontmatter.faq)) {
      errors.push('Faq must be an array when set');
    } else {
      frontmatter.faq.forEach((item, index) => {
        const entry = item as Record<string, unknown>;
        if (!entry || typeof entry.question !== 'string' || typeof entry.answer !== 'string') {
          errors.push(`Faq[${index}] must have a string question and answer`);
        }
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(`Blog frontmatter validation failed:\n${errors.join('\n')}`);
  }

  return frontmatter as unknown as BlogFrontmatter;
}
