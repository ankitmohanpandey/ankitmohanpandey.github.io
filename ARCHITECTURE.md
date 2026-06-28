# Architecture Documentation

## System Overview

This is an automated multi-platform publishing system built on Next.js 15 with a focus on developer experience, performance, and automation.

## Core Principles

1. **Single Source of Truth**: MDX files in `content/blog/` are the canonical source
2. **Automation First**: GitHub Actions handle the entire publishing pipeline
3. **Extensibility**: Adapter pattern allows easy addition of new platforms
4. **Type Safety**: TypeScript throughout with strict mode enabled
5. **Performance**: Static generation where possible, ISR for dynamic content

## Architecture Diagram

```
┌─────────────────┐
│  Content (MDX)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validation    │
│  (Frontmatter)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Build       │
│  (Next.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────┐  ┌──────────┐
│ Web  │  │  Social  │
│ Site │  │  Drafts  │
└───┬──┘  └────┬─────┘
    │          │
    ▼          ▼
┌──────┐  ┌──────────┐
│ RSS  │  │ Platforms│
│ Feed │  │ (Hashnode│
└───┬──┘  │ Beehiiv) │
    │    └────┬─────┘
    │         │
    ▼         ▼
┌──────────────────┐
│  SEO & Analytics│
└──────────────────┘
```

## Directory Structure

### `/app` - Next.js App Router

- **Layout**: Root layout with SEO metadata and analytics
- **Pages**: Home, About, Blog listing, Blog post pages
- **API Routes**: RSS feed, sitemap, robots.txt

### `/components` - React Components

- **Blog Components**: PostCard, TableOfContents, CodeBlock, RelatedPosts, Navigation
- **Layout Components**: Navbar, Footer
- **Analytics**: GA4, Clarity, Vercel Analytics integration

### `/lib` - Core Business Logic

- **Publishers**: Platform-specific publishing adapters
- **Validators**: Frontmatter validation
- **Types**: TypeScript type definitions
- **Blog**: Blog post utilities (getAll, getBySlug, related posts)
- **Utils**: General utilities (cn, formatDate, calculateReadingTime)

### `/content/blog` - Content Source

- **MDX Files**: Blog posts with frontmatter
- **Images**: Cover images and content images

### `/scripts` - Automation Scripts

- **generate-social.ts**: Generate LinkedIn and Twitter drafts
- **publish.ts**: Publish to all platforms
- **ping-google.ts**: Ping Google Indexing API

### `/.github/workflows` - CI/CD

- **ci.yml**: Lint, type-check, build
- **publish.yml**: Full publish pipeline

## Key Components

### Publisher Interface

```typescript
interface Publisher {
  name: string;
  publish(post: BlogPost): Promise<PublishResult>;
  validateConfig(): boolean;
}
```

This interface allows adding new platforms without modifying core logic.

### Blog Frontmatter Schema

```typescript
interface BlogFrontmatter {
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
```

### Content Pipeline

1. **Write**: Create MDX file with frontmatter
2. **Validate**: Frontmatter validation on build
3. **Build**: Next.js builds static pages
4. **Generate**: RSS, sitemap, social drafts
5. **Publish**: Deploy to Vercel, publish to platforms
6. **Index**: Ping Google Indexing API

## Data Flow

### Publishing Flow

```
User writes MDX → Git push → GitHub Actions → Validation → Build → 
Generate Social → Publish Platforms → Deploy → Ping Google
```

### Reading Flow

```
User visits site → Next.js serves static page → Analytics track → 
SEO metadata indexed
```

## Technology Choices

### Next.js 15 (App Router)

- **Why**: Latest features, server components, improved performance
- **Benefits**: Built-in optimization, easy deployment, great DX

### TypeScript

- **Why**: Type safety, better IDE support, catch errors early
- **Benefits**: Maintainability, scalability, developer confidence

### Tailwind CSS

- **Why**: Utility-first, small bundle size, easy customization
- **Benefits**: Fast development, consistent design, responsive by default

### MDX

- **Why**: Markdown with React components
- **Benefits**: Rich content, code highlighting, custom components

## Performance Optimization

### Static Generation

- Blog posts are statically generated at build time
- Only dynamic content uses ISR
- Sitemap and RSS are generated on-demand

### Image Optimization

- Next.js Image component
- Automatic WebP/AVIF conversion
- Responsive images

### Code Splitting

- Automatic route-based splitting
- Dynamic imports where needed
- Tree shaking

## Security Considerations

- Environment variables for sensitive data
- API keys in GitHub Secrets
- No hardcoded credentials
- Input validation
- Content sanitization

## Scalability

The system is designed to scale to thousands of articles:

- **Static Generation**: Fast page loads regardless of content size
- **Incremental Builds**: Only rebuild changed content
- **CDN**: Vercel's global CDN
- **Database-Free**: File-based content for simplicity

## Future Enhancements

1. **Search Integration**: Add Algolia or local search
2. **Comments**: Add commenting system (giscus, utterances)
3. **Newsletter**: Custom newsletter management
4. **Analytics Dashboard**: Custom analytics dashboard
5. **More Platforms**: Medium, Dev.to, etc.
6. **AI Content**: AI-powered content suggestions
7. **A/B Testing**: Test different headlines, layouts

## Monitoring

- **Vercel Analytics**: Page views, Core Web Vitals
- **Google Analytics**: User behavior, traffic sources
- **Microsoft Clarity**: User recordings, heatmaps
- **GitHub Actions**: Build and deployment status

## Backup Strategy

- **Git**: Content versioned in Git
- **Vercel**: Automatic deployments
- **Platforms**: Content syndicated to multiple platforms
- **RSS**: Feed serves as backup for subscribers

## Disaster Recovery

- **Git History**: Rollback to any version
- **Vercel Rollbacks**: One-click rollback
- **Platform APIs**: Can republish from MDX files
- **CDN Cache**: Automatic cache invalidation on deploy
