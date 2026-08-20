# Architecture

## The problem this solves

Ankit writes on Substack. A personal site that requires re-publishing every
essay by hand goes stale within a month. So the site treats Substack as a
first-class content source rather than something to copy from, while still
supporting hand-authored MDX for posts that need code blocks and diagrams.

## Content flow

```
  content/blog/*.mdx              https://…substack.com/feed
          │                                   │
          │ gray-matter                       │ fetch (revalidate: 3600, tag: substack)
          │ frontmatter validation            │ fast-xml-parser
          ▼                                   ▼
   lib/blog.ts                        lib/sources/substack.ts
   source: 'local'                    sanitize-html → source: 'substack'
          │                                   │
          └───────────────┬───────────────────┘
                          ▼
                   lib/content.ts
        merge · dedupe by slug (local wins) · sort by date
                          │
        ┌─────────────────┼──────────────────┬─────────────┐
        ▼                 ▼                  ▼             ▼
      /  (home)        /blog          /blog/[slug]     rss · sitemap
```

## Why it is shaped this way

**Two sources, one type.** Both paths produce a `BlogPost` carrying a `source`
discriminator. Pages never branch on origin except at the single render call
that picks MDX versus sanitised HTML. Adding a third source later means writing
one adapter, not touching every page.

**Local MDX wins ties.** Deduping by slug with local priority gives a
zero-migration upgrade path: publish a quick note on Substack, and later drop
an MDX file with the same slug to replace it with a fuller article.

**The feed never breaks the build.** `getSubstackPosts()` catches everything and
returns `[]`. A Substack outage during a deploy degrades to "site shows only
MDX posts", which is a bad afternoon rather than a failed release.

**Third-party HTML is untrusted.** Feed bodies go through `sanitize-html` with
an allowlist, external links get `rel="noreferrer noopener"`, and Substack's
tracking pixels are filtered out.

## Caching

| Surface | Strategy |
| --- | --- |
| `/`, `/blog`, `/blog/[slug]`, RSS, sitemap | ISR, `revalidate = 3600` |
| Substack feed fetch | Tagged `substack`, same window |
| `/api/revalidate` | Purges the tag and the two listing paths on demand |

Vercel cron calls the revalidate endpoint every six hours; the manual `?secret=`
call exists for "I just published and want it live now".

## Rendering

Almost everything is a server component. Client components are limited to three
places that genuinely need browser APIs:

- `Navbar` — active route + mobile toggle
- `TableOfContents` — scroll-spy via `IntersectionObserver`
- `CodeBlock` — clipboard

Headings for the table of contents are extracted from MDX source on the server
(`lib/headings.ts`, using the same slugger as `rehype-slug`) rather than scraped
from the DOM after paint. The client component only tracks which one is active.

The pipeline diagram on the home page is CSS keyframes, not JS.

## SEO

- Per-post `BlogPosting` JSON-LD
- `rel="canonical"` on mirrored posts points at Substack, so the original gets
  the ranking credit instead of competing with the mirror
- OG images generated at request time from `lib/site.ts` via `next/og`
- RSS and sitemap built from the merged timeline, so syndicated posts are
  included

## Deployment

Vercel Git integration owns deploys. CI only verifies (lint, type-check,
build). Cross-posting to Hashnode/Beehiiv is a manual `workflow_dispatch`,
because syndicating is a per-post decision.

## Known limitations

- **No table of contents on mirrored posts.** Substack's HTML has no stable
  heading ids. Fixing it means slugging headings during sanitisation.
- **Feed depth.** Substack RSS returns only recent items, so older essays will
  not appear unless written up as MDX.
- **No search.** Fine at current post counts; revisit past ~50 posts.
- **Tags are display-only.** There are no `/tags/[tag]` routes yet.
