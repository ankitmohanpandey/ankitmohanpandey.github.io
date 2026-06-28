import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ankitmohanpandey.in',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
