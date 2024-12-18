import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uxwing.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
};

export default nextConfig;
