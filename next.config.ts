import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is for self-hosting only — Vercel builds without it.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
