/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Ensure proper handling of server components (Next.js 15 syntax)
  serverExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
