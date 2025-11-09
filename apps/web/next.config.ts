import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: "http://localhost:3000/content/cheap",
      },
    ];
  },
};

export default nextConfig;
