import { XMLParser } from 'fast-xml-parser';
import sanitizeHtml from 'sanitize-html';
import { BlogPost } from '@/lib/types/blog';
import { site } from '@/lib/site';
import { calculateReadingTime, slugify } from '@/lib/utils';

/**
 * Substack is the place Ankit actually writes. Rather than asking him to
 * duplicate every essay as MDX, the site mirrors the public RSS feed and
 * renders those posts inline, always linking back to the original.
 */

const FEED_REVALIDATE_SECONDS = 60 * 60;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  // Substack wraps bodies in CDATA; the default merges that into the tag value.
  processEntities: true,
});

/** Substack bodies are trusted-ish but still third-party HTML, so scrub them. */
function clean(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'b', 'i', 'u', 's', 'code', 'pre', 'blockquote',
      'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['id'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noreferrer noopener',
      }),
    },
    // Substack injects subscribe widgets and tracking pixels; drop them.
    exclusiveFilter: (frame) =>
      frame.tag === 'img' && /pixel|open\.substack|beacon/.test(frame.attribs.src ?? ''),
  });
}

function toPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
}

function firstImage(html: string): string | undefined {
  return /<img[^>]+src=["']([^"']+)["']/i.exec(html)?.[1];
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function itemToPost(item: unknown): BlogPost | null {
  if (!isRecord(item)) return null;

  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const link = typeof item.link === 'string' ? item.link.trim() : '';
  if (!title || !link) return null;

  try {
    const url = new URL(link);
    if (
      url.protocol !== 'https:' ||
      url.origin !== new URL(site.substackFeed).origin ||
      url.username ||
      url.password
    ) return null;
  } catch {
    return null;
  }

  if (typeof item.pubDate !== 'string' || !item.pubDate.trim()) return null;
  const publishedDate = new Date(item.pubDate);
  if (!Number.isFinite(publishedDate.getTime())) return null;

  const rawDescription = typeof item.description === 'string' ? item.description : '';
  const body = typeof item['content:encoded'] === 'string'
    ? item['content:encoded']
    : rawDescription;
  const html = clean(body);
  const text = toPlainText(html);

  const description =
    toPlainText(rawDescription).slice(0, 200) || text.slice(0, 200);
  const tags = [...new Set(asArray(item.category)
    .filter((category): category is string => typeof category === 'string')
    .map((category) => category.trim())
    .filter(Boolean))];
  const enclosureUrl = isRecord(item.enclosure) && typeof item.enclosure['@_url'] === 'string'
    ? item.enclosure['@_url']
    : undefined;

  return {
    slug: slugify(title),
    source: 'substack',
    externalUrl: link,
    html,
    content: '',
    readingTime: calculateReadingTime(text),
    frontmatter: {
      title,
      description,
      tags,
      categories: ['Newsletter'],
      coverImage: enclosureUrl ?? firstImage(html),
      author: site.name,
      publishedDate: publishedDate.toISOString(),
      canonicalUrl: link,
    },
  };
}

export function parseSubstackFeed(xml: string): BlogPost[] {
  const parsed: unknown = parser.parse(xml);
  if (!isRecord(parsed) || !isRecord(parsed.rss)) return [];
  const channel = parsed.rss.channel;
  if (!isRecord(channel)) return [];

  return asArray(channel.item)
    .map(itemToPost)
    .filter((post): post is BlogPost => post !== null);
}

/**
 * Fetches the Substack feed. Never throws: a flaky feed should degrade to
 * "no syndicated posts", not take the whole site build down.
 */
export async function getSubstackPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(site.substackFeed, {
      headers: { 'User-Agent': `${site.handle}.in feed mirror` },
      next: { revalidate: FEED_REVALIDATE_SECONDS, tags: ['substack'] },
    });

    if (!response.ok) {
      console.warn(`[substack] feed responded ${response.status}`);
      return [];
    }

    return parseSubstackFeed(await response.text());
  } catch (error) {
    console.warn('[substack] feed unavailable:', error);
    return [];
  }
}
