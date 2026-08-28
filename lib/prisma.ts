/**
 * Prisma Client Singleton for Next.js
 *
 * Next.js hot-reloading in development creates new module instances on every
 * file change. This singleton pattern prevents creating multiple Prisma Client
 * instances, which would exhaust the database connection pool.
 *
 * Usage:
 *   import { prisma } from '@/lib/prisma';
 *   const items = await prisma.deploymentProduct.findMany();
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
