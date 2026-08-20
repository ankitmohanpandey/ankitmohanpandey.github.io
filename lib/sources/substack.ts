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

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { '#text'?: string };
  pubDate?: string;
  description?: string;
  'content:encoded'?: string;
  category?: string | string[];
  enclosure?: { '@_url'?: string };
}

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

function itemToPost(item: RssItem): BlogPost | null {
  const title = item.title?.trim();
  const link = item.link?.trim();
  if (!title || !link) return null;

  const body = item['content:encoded'] ?? item.description ?? '';
  const html = clean(body);
  const text = toPlainText(html);

  const description =
    toPlainText(item.description ?? '').slice(0, 200) || text.slice(0, 200);

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
      tags: asArray(item.category).filter(Boolean),
      categories: ['Newsletter'],
      coverImage: item.enclosure?.['@_url'] ?? firstImage(html),
      author: site.name,
      publishedDate: new Date(item.pubDate ?? Date.now()).toISOString(),
      canonicalUrl: link,
    },
  };
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

    const parsed = parser.parse(await response.text());
    const items = asArray<RssItem>(parsed?.rss?.channel?.item);

    return items
      .map(itemToPost)
      .filter((post): post is BlogPost => post !== null);
  } catch (error) {
    console.warn('[substack] feed unavailable:', error);
    return [];
  }
}
