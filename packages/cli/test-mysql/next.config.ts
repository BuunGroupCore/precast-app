import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@/components", "@/lib", "@/utils"],
  },
};

export default nextConfig;
