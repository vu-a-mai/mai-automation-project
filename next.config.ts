import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for hosting
  output: 'export',
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  // Optional: Ignore these during build to speed it up
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
