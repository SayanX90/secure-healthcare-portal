// Load env vars from parent .env.local for local dev.
// On Vercel, dotenv isn't installed — env vars are injected by the platform.
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
} catch (_) {}

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
