# Ankit Mohan Pandey - Automated Multi-Platform Publishing System

A production-grade automated publishing platform built with Next.js 15, TypeScript, and Tailwind CSS. Write once, publish everywhere - automatically.

## 🚀 Features

- **Single Source of Truth**: Write content in MDX, publish to multiple platforms automatically
- **Automated Publishing**: GitHub Actions workflow handles deployment, RSS, newsletters, and social media
- **Multi-Platform Support**: Hashnode, Beehiiv, LinkedIn, Twitter/X
- **SEO Optimized**: Automatic sitemap, robots.txt, OpenGraph, JSON-LD structured data
- **Analytics Integration**: GA4, Microsoft Clarity, Vercel Analytics
- **Modern Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, MDX
- **Performance Optimized**: Lighthouse 100 target, Core Web Vitals optimized

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── blog/                # Blog pages
│   ├── rss.xml/             # RSS feed generation
│   ├── layout.tsx           # Root layout with SEO
│   ├── page.tsx             # Homepage
│   ├── sitemap.ts           # Sitemap generation
│   └── robots.ts            # Robots.txt generation
├── components/              # React components
│   ├── blog/                # Blog-specific components
│   ├── Analytics.tsx        # Analytics integration
│   ├── Navbar.tsx           # Navigation
│   └── Footer.tsx           # Footer
├── content/blog/            # MDX blog posts
├── lib/                     # Core utilities
│   ├── publishers/          # Platform publishers (Hashnode, Beehiiv)
│   ├── validators/          # Frontmatter validation
│   ├── types/               # TypeScript types
│   ├── blog.ts              # Blog utilities
│   └── utils.ts             # General utilities
├── scripts/                 # Automation scripts
│   ├── generate-social.ts   # Generate LinkedIn/Twitter drafts
│   ├── publish.ts           # Publish to all platforms
│   └── ping-google.ts       # Google Indexing API
├── social/                  # Generated social media content
│   ├── linkedin/            # LinkedIn post drafts
│   └── twitter/             # Twitter thread drafts
└── .github/workflows/       # CI/CD workflows
    ├── ci.yml               # Lint, type-check, build
    └── publish.yml          # Full publish pipeline
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with syntax highlighting
- **Hosting**: Vercel
- **Automation**: GitHub Actions
- **Analytics**: GA4, Microsoft Clarity, Vercel Analytics

## 📝 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Add your API keys to .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=XXXXXXXXXX

# SEO
GOOGLE_SITE_VERIFICATION=XXXXXXXXXX

# Hashnode
HASHNODE_API_KEY=your_hashnode_api_key
HASHNODE_PUBLICATION_ID=your_publication_id

# Beehiiv
BEEHIIV_API_KEY=your_beehiiv_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id

# Google Indexing API
GOOGLE_INDEXING_API_KEY=your_google_indexing_api_key

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 📝 Creating Blog Posts

1. Create a new MDX file in `content/blog/` with the following frontmatter:

```mdx
---
title: Your Post Title
description: A brief description of your post
tags: ['tag1', 'tag2', 'tag3']
categories: ['Data Engineering']
coverImage: /images/cover.jpg
author: Ankit Mohan Pandey
publishedDate: 2024-01-01
updatedDate: 2024-01-02
draft: false
---

Your content here...
```

2. The post will automatically be:
   - Validated for frontmatter
   - Added to the blog listing
   - Included in RSS feed
   - Added to sitemap

## 🚀 Publishing Workflow

When you push to `main` branch:

1. **Validation**: Frontmatter validation, type checking, linting
2. **Build**: Next.js production build
3. **Social Generation**: LinkedIn and Twitter drafts generated
4. **Platform Publishing**: 
   - Hashnode (via GraphQL API)
   - Beehiiv (via REST API)
5. **Deployment**: Deploy to Vercel
6. **SEO**: Ping Google Indexing API

### Manual Publishing

```bash
# Generate social media drafts
npm run generate-social

# Publish to all platforms
npm run publish
```

## 🔧 Architecture

### Publisher Interface

The system uses an adapter pattern for platform publishers:

```typescript
interface Publisher {
  name: string;
  publish(post: BlogPost): Promise<PublishResult>;
  validateConfig(): boolean;
}
```

Each platform (Hashnode, Beehiiv, etc.) implements this interface, making it easy to add new platforms.

### Content Pipeline

```
MDX File → Validation → Build → Deploy → RSS → Newsletter → Social → SEO
```

## 📊 SEO Features

- **Automatic Sitemap**: Generated at `/sitemap.xml`
- **Robots.txt**: Configured at `/robots.txt`
- **RSS Feed**: Available at `/rss.xml`
- **OpenGraph**: Dynamic OG tags for all pages
- **JSON-LD**: Structured data for blog posts
- **Canonical URLs**: Prevents duplicate content issues
- **Meta Tags**: Optimized for search engines

## 🔒 Security

- Environment variables for sensitive data
- API keys stored in GitHub Secrets
- No hardcoded credentials
- Content validation before publishing

## 📈 Performance

- **Lighthouse Score**: Target 100
- **Core Web Vitals**: Optimized
- **Image Optimization**: Next.js Image component
- **Static Generation**: Where possible
- **ISR**: Incremental Static Regeneration

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### GitHub Actions

The `.github/workflows/publish.yml` handles the entire pipeline automatically.

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Hashnode API](https://hashnode.com/docs/api)
- [Beehiiv API](https://www.beehiiv.com/api)

## 🤝 Contributing

This is a personal project, but feel free to use it as inspiration for your own publishing platform.

## 📄 License

This project is open source. Feel to use and modify as needed.

---

Built with ❤️ by Ankit Mohan Pandey
