import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  reactStrictMode: true
};


export default nextConfig;
