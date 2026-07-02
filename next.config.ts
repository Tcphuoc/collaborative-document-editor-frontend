import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.API_VERSION}/:path*`,
      },
    ];
  },
};

export default nextConfig;
