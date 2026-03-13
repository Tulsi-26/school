import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "prisma",
    "mongodb",
    "@prisma/client",
  ],
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
