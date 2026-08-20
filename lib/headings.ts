import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

const FENCE = /^\s*(```|~~~)/;
const ATX = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

/** Strips inline markdown so the label reads as plain text. */
function stripInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();
}

/**
 * Pulls h2/h3 headings out of MDX source. Ids are generated with the same
 * slugger rehype-slug uses, so the anchors line up with the rendered output.
 */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = ATX.exec(line);
    if (!match) continue;

    const text = stripInline(match[2]);
    headings.push({ id: slugger.slug(text), text, level: match[1].length });
  }

  return headings;
}
