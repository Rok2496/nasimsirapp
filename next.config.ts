import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'nasimsir.onrender.com',
        port: '',
        pathname: '/static/**',
      },
    ],
  },
};

export default nextConfig;