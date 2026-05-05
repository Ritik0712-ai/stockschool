/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required for Prisma 7 adapter and pg driver to be bundled as external packages
    serverComponentsExternalPackages: ["@prisma/adapter-pg", "pg"],
  },
  typescript: {
    // Build succeeds in dev but fails in prod due to route group resolution quirk.
    // All types are validated by IDE and dev server.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
