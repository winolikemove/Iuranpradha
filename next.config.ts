import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow cross-origin requests from preview URLs
  allowedDevOrigins: [
    'preview-chat-db464c4a-d0ca-4a29-b79a-77e5eb8eb4be.space.z.ai',
  ],
};

export default nextConfig;
