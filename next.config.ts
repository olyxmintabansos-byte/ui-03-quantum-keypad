import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/ui-03-quantum-keypad",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
