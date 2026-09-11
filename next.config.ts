import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content Security Policy.
 *
 * script-src carries 'unsafe-inline' because Next.js emits inline bootstrap
 * and flight-payload scripts on every prerendered page. Removing it requires
 * per-request nonces, which forces every route out of static generation — a
 * bad trade for a content site with no auth and no user-submitted HTML.
 * Everything else is locked down, and the one third-party HTML source
 * (Substack) is sanitised server-side before it reaches the page.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://substackcdn.com https://substack-post-media.s3.amazonaws.com https://www.google-analytics.com https://c.clarity.ms",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.clarity.ms https://va.vercel-scripts.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ankitmohanpandey.in' },
      { protocol: 'https', hostname: 'substackcdn.com' },
      { protocol: 'https', hostname: 'substack-post-media.s3.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    mdxRs: true,
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Note: Next.js already sets `public, max-age=31536000, immutable` on
      // hashed /_next/static assets itself, and that cannot be overridden.
      // Setting it manually here is redundant and, in dev, makes Turbopack's
      // unhashed chunks get cached forever — which causes hydration
      // mismatches after source edits. So we do not add a static rule.
    ];
  },
};

export default nextConfig;
