export interface BlogFrontmatter {
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  coverImage?: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  readingTime?: number;
  draft?: boolean;
  canonicalUrl?: string;
}

/** Where a post's body came from, which decides how it gets rendered. */
export type PostSource = 'local' | 'substack';

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  /** MDX source for local posts; empty for syndicated ones. */
  content: string;
  readingTime: number;
  source: PostSource;
  /** Sanitised HTML body, only present for syndicated posts. */
  html?: string;
  /** Canonical link on the originating platform. */
  externalUrl?: string;
}

export interface SocialPost {
  platform: 'linkedin' | 'twitter';
  articleSlug: string;
  content: string;
  generatedAt: string;
}
