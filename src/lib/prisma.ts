import { ENV, isProd } from "@/lib/config/env";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: ENV.DATABASE_URL } },
  });

if (!isProd) globalForPrisma.prisma = prisma;

export default prisma;
