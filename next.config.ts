import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
},
};

module.exports = {
  swcMinify: false,
};
export default nextConfig;
