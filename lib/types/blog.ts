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

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
}

export interface SocialPost {
  platform: 'linkedin' | 'twitter';
  articleSlug: string;
  content: string;
  generatedAt: string;
}
