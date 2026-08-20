import { BlogPost } from './types/blog';
import { getAllBlogPosts } from './blog';
import { getSubstackPosts } from './sources/substack';

/**
 * The site has two content sources: MDX committed to this repo, and essays
 * mirrored from Substack. This module merges them into one timeline so every
 * page can stay unaware of where a post originated.
 *
 * A local MDX file always wins over a syndicated post with the same slug,
 * which is the escape hatch for turning a newsletter issue into a properly
 * formatted article later.
 */

export async function getAllPosts(): Promise<BlogPost[]> {
  const [local, syndicated] = await Promise.all([
    Promise.resolve(getAllBlogPosts()),
    getSubstackPosts(),
  ]);

  const localSlugs = new Set(local.map((post) => post.slug));

  return [...local, ...syndicated.filter((post) => !localSlugs.has(post.slug))].sort(
    (a, b) =>
      new Date(b.frontmatter.publishedDate).getTime() -
      new Date(a.frontmatter.publishedDate).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Posts sharing at least one tag or category with the given post. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) return [];

  const overlaps = (a: string[], b: string[]) => a.some((value) => b.includes(value));

  return posts
    .filter((post) => post.slug !== slug)
    .filter(
      (post) =>
        overlaps(post.frontmatter.tags, current.frontmatter.tags) ||
        overlaps(post.frontmatter.categories, current.frontmatter.categories)
    )
    .slice(0, limit);
}

export async function getAdjacentPosts(slug: string): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
}> {
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/** Tag counts across the merged timeline, most used first. */
export async function getTagCounts(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
