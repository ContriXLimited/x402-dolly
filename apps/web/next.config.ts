import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://p01--dolly-ai-elcs--jlqhr9wl7sxr.code.run/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
