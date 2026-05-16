require('dotenv').config({ path: '../.env.local' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
