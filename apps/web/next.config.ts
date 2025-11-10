import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Only proxy chat-related endpoints to external backend
      // /api/projects will use local route handler
      {
        source: "/api/chat/:path*",
        destination: "https://p01--dolly-ai-elcs--jlqhr9wl7sxr.code.run/api/chat/:path*",
      },
    ];
  },
};

export default nextConfig;
