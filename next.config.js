/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Ensure proper handling of server components (Next.js 15 syntax)
  // Include libsql packages to prevent webpack bundling issues
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-libsql',
    '@libsql/client',
    'libsql',
  ],
};

module.exports = nextConfig;
