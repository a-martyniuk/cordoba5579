import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/cordoba5579',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        pathname: "/im/pictures/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
