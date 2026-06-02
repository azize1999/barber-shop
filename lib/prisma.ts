// Prisma client singleton
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development we reuse the same client across hot‑module reloads
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient({
      log: process.env.DEBUG ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  prisma = (globalThis as any).prisma;
}

// Log Prisma client initialization (for debugging)
if (process.env.DEBUG) {
  console.log('[Prisma] Client initialized', {
    env: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE_URL,
  });
}

export { prisma };