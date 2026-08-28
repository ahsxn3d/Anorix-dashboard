import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from UploadThing CDN and external media providers
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
