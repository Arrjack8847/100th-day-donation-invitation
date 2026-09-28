import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  allowedDevOrigins: ["192.168.0.9"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
