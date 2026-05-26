// Prisma client singleton
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development we reuse the same client across hot‑module reloads
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient();
  }
  prisma = (globalThis as any).prisma;
}

export { prisma };