import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prismaClient?: PrismaClient;
};

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForPrisma.prismaClient) {
    globalForPrisma.prismaClient = new PrismaClient();
  }

  return globalForPrisma.prismaClient;
}
