import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/product/:slug*",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
          }
        ]
      }
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080],
    imageSizes: [48, 68, 96, 128, 180, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;

