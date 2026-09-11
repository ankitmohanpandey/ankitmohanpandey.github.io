import fs from 'fs';
import path from 'path';
import { site } from '../lib/site';

/**
 * Scaffold a new MDX post at content/blog/<slug>.mdx with complete
 * frontmatter. Run via `npx tsx scripts/new-post.ts <slug>`.
 *
 * Usage:
 *   npx tsx scripts/new-post.ts streaming-watermarks \
 *     --title "Watermarks" \
 *     --description "Why event-time beats processing-time" \
 *     --tags streaming,flink \
 *     --categories Engineering \
 *     --cover-image https://... \
 *     --updated-date 2026-09-08 \
 *     --publish
 *
 * The post is drafted with draft:true by default — pass --publish to draft:false.
 */

const contentDirectory = path.join(process.cwd(), 'content/blog');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface Options {
  slug: string;
  title?: string;
  description?: string;
  tags: string[];
  categories: string[];
  coverImage?: string;
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
  draft: boolean;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function humanize(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseArgs(argv: string[]): Options {
  const args = argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error('Usage: npx tsx scripts/new-post.ts <slug> [--title "…"] [--description "…"]');
    console.error('  --tags a,b --categories Engineering --cover-image <url>');
    console.error('  --published-date YYYY-MM-DD --updated-date YYYY-MM-DD --author "…" --publish');
    process.exit(1);
  }

  const slug = args[0];
  if (!SLUG_PATTERN.test(slug)) {
    console.error(
      `Invalid slug "${slug}" — use lowercase letters, digits and hyphens (e.g. my-new-post).`
    );
    process.exit(1);
  }

  const options: Options = {
    slug,
    tags: [],
    categories: ['Engineering'],
    draft: true,
  };

  for (let i = 1; i < args.length; i += 1) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case '--title':
      case '--description':
      case '--cover-image':
      case '--author':
      case '--published-date':
      case '--updated-date': {
        if (!value || value.startsWith('--')) {
          console.error(`Missing value for ${flag}`);
          process.exit(1);
        }
        if (flag === '--title') options.title = value;
        if (flag === '--description') options.description = value;
        if (flag === '--cover-image') options.coverImage = value;
        if (flag === '--author') options.author = value;
        if (flag === '--published-date') options.publishedDate = value;
        if (flag === '--updated-date') options.updatedDate = value;
        i += 1;
        break;
      }
      case '--tags':
      case '--categories': {
        if (!value) {
          console.error(`Missing value for ${flag}`);
          process.exit(1);
        }
        const list = value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        if (flag === '--tags') options.tags = list;
        if (flag === '--categories') options.categories = list;
        i += 1;
        break;
      }
      case '--publish':
        options.draft = false;
        break;
      default:
        console.error(`Unknown flag: ${flag}`);
        process.exit(1);
    }
  }

  return options;
}

function yamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function yamlList(values: string[]): string {
  return `[${values.map(yamlString).join(', ')}]`;
}

function scaffold(options: Options): void {
  const fileName = `${options.slug}.mdx`;
  const filePath = path.join(contentDirectory, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`Refusing to overwrite existing post: ${filePath}`);
    process.exit(1);
  }

  fs.mkdirSync(contentDirectory, { recursive: true });

  const title = options.title ?? humanize(options.slug);
  const description = options.description ?? 'One sentence that shows up in listings and social cards.';
  const publishedDate = options.publishedDate ?? today();

  const lines: string[] = ['---'];
  lines.push(`title: ${yamlString(title)}`);
  lines.push(`description: ${yamlString(description)}`);
  lines.push(`tags: ${yamlList(options.tags)}`);
  lines.push(`categories: ${yamlList(options.categories)}`);
  lines.push(`author: ${yamlString(options.author ?? site.name)}`);
  lines.push(`publishedDate: ${yamlString(publishedDate)}`);
  if (options.updatedDate) lines.push(`updatedDate: ${yamlString(options.updatedDate)}`);
  if (options.coverImage) lines.push(`coverImage: ${yamlString(options.coverImage)}`);
  lines.push(`draft: ${options.draft}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${title}`);
  lines.push('');
  lines.push('Write the post here.');
  lines.push('');

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`✓ Created ${filePath}`);
  console.log(`  Status: ${options.draft ? 'draft (set draft:false to publish)' : 'ready to publish'}`);
}

scaffold(parseArgs(process.argv));