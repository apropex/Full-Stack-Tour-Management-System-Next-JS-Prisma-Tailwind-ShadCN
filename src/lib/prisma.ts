import { env } from "@/utils/env";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: env("DATABASE_URL") } },
  });

if (env("NODE_ENV") !== "production") globalForPrisma.prisma = prisma;

export default prisma;
