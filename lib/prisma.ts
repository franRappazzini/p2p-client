import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;

  return new PrismaClient({
    // log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // En Prisma v7, la URL se pasa via accelerateUrl
    // ...(databaseUrl && { accelerateUrl: databaseUrl }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
