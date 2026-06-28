# Deployment Guide

This guide covers deploying the automated publishing system to production.

## Prerequisites

- GitHub account
- Vercel account
- Hashnode account (optional)
- Beehiiv account (optional)
- Google Analytics account (optional)

## Step 1: GitHub Repository Setup

1. **Push your code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourrepo.git
git push -u origin main
```

2. **Configure GitHub Secrets**

Go to your repository Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

```
HASHNODE_API_KEY=your_hashnode_api_key
HASHNODE_PUBLICATION_ID=your_publication_id
BEEHIIV_API_KEY=your_beehiiv_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id
GOOGLE_INDEXING_API_KEY=your_google_indexing_api_key
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## Step 2: Vercel Deployment

### Option A: Automatic Deployment (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_CLARITY_ID=XXXXXXXXXX
   NEXT_PUBLIC_VERCEL_ANALYTICS_ID=XXXXXXXXXX
   GOOGLE_SITE_VERIFICATION=XXXXXXXXXX
   ```
6. Click "Deploy"

### Option B: Manual Deployment

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login:

```bash
vercel login
```

3. Deploy:

```bash
vercel --prod
```

## Step 3: Domain Configuration

### Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `ankitmohanpandey.in`)
3. Update DNS records:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`

4. Wait for SSL certificate to be issued (automatic)

### CNAME File

For GitHub Pages compatibility, create a `CNAME` file:

```bash
echo "ankitmohanpandey.in" > public/CNAME
git add public/CNAME
git commit -m "Add CNAME"
git push
```

## Step 4: Platform Integration

### Hashnode

1. Go to [Hashnode Settings](https://hashnode.com/settings)
2. Navigate to "API Keys"
3. Generate a new API key
4. Get your publication ID from URL: `https://hashnode.com/@username/publication-id`
5. Add to GitHub Secrets:
   - `HASHNODE_API_KEY`
   - `HASHNODE_PUBLICATION_ID`

### Beehiiv

1. Go to [Beehiiv Settings](https://app.beehiiv.com/settings)
2. Navigate to "API Keys"
3. Generate a new API key
4. Get your publication ID from URL: `https://app.beehiiv.com/dashboard/publication-id`
5. Add to GitHub Secrets:
   - `BEEHIIV_API_KEY`
   - `BEEHIIV_PUBLICATION_ID`

### Google Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Add to Vercel environment variables:
   - `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

### Microsoft Clarity

1. Go to [Microsoft Clarity](https://clarity.microsoft.com)
2. Create a new project
3. Get your Project ID
4. Add to Vercel environment variables:
   - `NEXT_PUBLIC_CLARITY_ID=XXXXXXXXXX`

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership using HTML meta tag
4. Get verification code
5. Add to Vercel environment variables:
   - `GOOGLE_SITE_VERIFICATION=XXXXXXXXXX`

### Google Indexing API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Indexing API
4. Create service account
5. Download JSON key file
6. Convert to API key
7. Add to GitHub Secrets:
   - `GOOGLE_INDEXING_API_KEY`

## Step 5: GitHub Actions Configuration

The workflows are already configured in `.github/workflows/`:

### CI Workflow (.github/workflows/ci.yml)

Runs on every push and PR:
- Linting
- Type checking
- Building

### Publish Workflow (.github/workflows/publish.yml)

Runs on push to main:
- Validation
- Social generation
- Platform publishing
- Deployment
- Google indexing

## Step 6: Testing

### Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test build
npm run build

# Test type checking
npm run type-check

# Test linting
npm run lint
```

### Production Testing

1. Deploy to preview environment:
   ```bash
   vercel
   ```

2. Test the preview URL

3. Deploy to production:
   ```bash
   vercel --prod
   ```

## Step 7: Monitoring

### Vercel Analytics

- Go to Vercel project dashboard
- View analytics in "Analytics" tab

### Google Analytics

- Go to [Google Analytics](https://analytics.google.com)
- View real-time and historical data

### GitHub Actions

- Go to repository "Actions" tab
- Monitor workflow runs

## Step 8: Content Migration

If migrating from an existing site:

1. **Export existing content** to Markdown
2. **Convert to MDX** with proper frontmatter
3. **Add to `content/blog/`** directory
4. **Test locally** with `npm run dev`
5. **Commit and push** to trigger deployment

## Step 9: Automation Verification

Verify the full pipeline:

1. Create a test blog post in `content/blog/test.mdx`
2. Commit and push to main
3. Monitor GitHub Actions
4. Check Vercel deployment
5. Verify Hashnode publication
6. Verify Beehiiv newsletter
7. Check RSS feed at `/rss.xml`
8. Check sitemap at `/sitemap.xml`
9. Verify social drafts in `social/` directory

## Troubleshooting

### Build Failures

```bash
# Check build logs in GitHub Actions
# Check Vercel deployment logs
# Run locally: npm run build
```

### Environment Variables

```bash
# Verify variables are set in Vercel dashboard
# Check GitHub Secrets
# Restart deployment after adding variables
```

### Platform Publishing

```bash
# Verify API keys are correct
# Check platform API status
# Test manually: npm run publish
```

### Domain Issues

```bash
# Verify DNS records
# Check SSL certificate status
# Wait for DNS propagation (up to 48 hours)
```

## Rollback Procedure

If something goes wrong:

### Vercel Rollback

1. Go to Vercel project dashboard
2. Click "Deployments"
3. Find previous successful deployment
4. Click "..." → "Promote to Production"

### Git Rollback

```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force
```

## Maintenance

### Regular Tasks

- **Weekly**: Check analytics
- **Monthly**: Review and update dependencies
- **Quarterly**: Review and optimize performance
- **Annually**: Renew SSL certificates (automatic with Vercel)

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit fix
```

## Performance Monitoring

### Lighthouse

Run Lighthouse audit regularly:

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://ankitmohanpandey.in
```

Target scores:
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Core Web Vitals

Monitor in:
- Google Search Console
- Vercel Analytics
- PageSpeed Insights

## Security Checklist

- [ ] Environment variables configured
- [ ] API keys in GitHub Secrets
- [ ] No hardcoded credentials
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies audited
- [ ] Regular updates applied

## Support

For issues:
- Check [Next.js documentation](https://nextjs.org/docs)
- Check [Vercel documentation](https://vercel.com/docs)
- Check GitHub Actions logs
- Open an issue in the repository
