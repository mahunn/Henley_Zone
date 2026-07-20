import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow 50MB local memory cache to guarantee fast responses if Redis is unavailable
  cacheMaxMemorySize: 50 * 1024 * 1024,
  async headers() {
    return [
      {
        source: "/p/:slug*",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
          }
        ]
      },
      {
        source: "/product/:slug*",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
          }
        ]
      }
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;


