import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fernandohollandaphotography.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "www.fernandohollandaphotography.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
