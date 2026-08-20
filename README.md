# ankitmohanpandey.in

Personal site and engineering blog. Next.js 16 (App Router), Tailwind v4, MDX,
deployed on Vercel.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run generate-social` | Write LinkedIn/X drafts to `social/` |

CI runs lint, type-check and build on every push and PR.

## How content works

There are two sources of posts and they land in the same timeline:

1. **MDX in `content/blog/`** — full control, code blocks, diagrams, components.
2. **Substack** — the public RSS feed at `site.substackFeed` is fetched, cleaned
   and rendered inline, always linking back to the original.

`lib/content.ts` merges them, sorts by publish date, and dedupes by slug. **A
local MDX file always wins over a Substack post with the same slug**, which is
how you promote a newsletter issue into a properly formatted article: write the
MDX, and the mirrored copy disappears on the next revalidation.

Nothing needs to be committed for a Substack post to appear. Pages carry
`revalidate = 3600`, so a new essay shows up within the hour.

### Publishing immediately

To skip the wait:

```bash
curl "https://ankitmohanpandey.in/api/revalidate?secret=$REVALIDATE_SECRET"
```

A Vercel cron hits the same endpoint every six hours as a backstop.

### Writing an MDX post

Create `content/blog/my-post.mdx`:

```mdx
---
title: 'Why watermarks are not a scheduling problem'
description: 'One sentence that shows up in listings, search results and social cards.'
tags: ['flink', 'streaming']
categories: ['Engineering']
author: 'Ankit Mohan Pandey'
publishedDate: '2026-08-21'
draft: false
---

Body starts here.
```

Frontmatter is validated at read time (`lib/validators/blog.ts`) — a malformed
post fails the build rather than rendering broken. Set `draft: true` to keep it
out of listings.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `REVALIDATE_SECRET` | for on-demand sync | Guards `/api/revalidate` |
| `CRON_SECRET` | for the Vercel cron | Set to the **same value** as `REVALIDATE_SECRET` |
| `NEXT_PUBLIC_GA_ID` | optional | Google Analytics 4 |
| `NEXT_PUBLIC_CLARITY_ID` | optional | Microsoft Clarity |
| `HASHNODE_API_KEY` / `HASHNODE_PUBLICATION_ID` | optional | Cross-posting |
| `BEEHIIV_API_KEY` / `BEEHIIV_PUBLICATION_ID` | optional | Cross-posting |
| `GOOGLE_INDEXING_API_KEY` | optional | Indexing API pings |

## Deployment

Vercel's Git integration builds and deploys `main`. There is no deploy step in
CI on purpose — one system owns deployment.

Domain setup:

1. Add `ankitmohanpandey.in` in the Vercel project's Domains tab.
2. Point the apex record at Vercel per the instructions it gives you.
3. Disable GitHub Pages on this repo.

> [!IMPORTANT]
> This repo is named `ankitmohanpandey.github.io`, so GitHub Pages will try to
> serve it. The static HTML it used to serve has been deleted. Turn Pages off,
> or it will publish a broken site alongside the real one.

## Editing site content

Most copy lives in data files rather than JSX:

- `lib/site.ts` — name, role, socials, feed URL, nav
- `lib/work.ts` — selected projects and capability areas
- `app/about/page.tsx` — the about narrative and working principles

## Layout

```
app/                 routes, RSS, sitemap, OG image, revalidate endpoint
components/          Shell, nav/footer, home sections, blog UI
content/blog/        MDX posts
lib/                 content layer, sources, publishers, validators
scripts/             social draft generation, cross-posting, indexing pings
```

See `ARCHITECTURE.md` for how the pieces fit together.
