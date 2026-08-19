import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2_678_400,
    remotePatterns: [
      {
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
        protocol: "https",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
