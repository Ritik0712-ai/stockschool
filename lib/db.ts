import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Prisma client singleton pattern for Prisma v7.
 *
 * Prisma 7 uses driver adapters instead of the Rust binary engine.
 * We use @prisma/adapter-pg with the `pg` driver for PostgreSQL.
 *
 * The local Prisma Postgres URL (prisma+postgres://) decodes to a
 * standard postgresql:// URL in the API key payload. For local dev
 * we extract the real URL from the embedded config.
 */

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || "";

  // If using Prisma local dev server (prisma+postgres://), extract the real postgres URL
  if (url.startsWith("prisma+postgres://")) {
    try {
      const urlObj = new URL(url);
      const apiKey = urlObj.searchParams.get("api_key");
      if (apiKey) {
        const decoded = JSON.parse(
          Buffer.from(apiKey, "base64").toString("utf-8")
        );
        if (decoded.databaseUrl) {
          return decoded.databaseUrl;
        }
      }
    } catch {
      // Fall through to raw URL
    }
  }

  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const connectionString = getDatabaseUrl();
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
