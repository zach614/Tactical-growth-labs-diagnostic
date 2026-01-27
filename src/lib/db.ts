import { PrismaClient } from '@prisma/client';

// PrismaClient singleton pattern for Next.js
// Uses lazy initialization to avoid build-time issues with libsql adapter

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

async function createPrismaClientAsync(): Promise<PrismaClient> {
  // Check if we have Turso credentials (production/Vercel)
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoAuthToken) {
    // Dynamic import to avoid build-time initialization issues
    const { PrismaLibSql } = await import('@prisma/adapter-libsql');

    // Use Turso/libSQL adapter for production
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    } as any);
  }

  // Fall back to local SQLite for development (if no Turso credentials)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// For synchronous access (development without Turso)
function createPrismaClientSync(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// Lazy getter for prisma client
let prismaPromise: Promise<PrismaClient> | null = null;

export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!prismaPromise) {
    prismaPromise = createPrismaClientAsync().then((client) => {
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
      }
      return client;
    });
  }

  return prismaPromise;
}

// For backwards compatibility - sync version for dev only
export const prisma = globalForPrisma.prisma ?? createPrismaClientSync();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
