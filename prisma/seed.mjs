import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const ADMIN_SEED_USERNAME = process.env.ADMIN_SEED_USERNAME;
const ADMIN_SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD;
const ADMIN_SEED_EMAIL = process.env.ADMIN_SEED_EMAIL || null;

const passwordOptions = {
  algorithm: 2,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
  outputLen: 32
};

async function main() {
  if (!ADMIN_SEED_USERNAME || !ADMIN_SEED_PASSWORD) {
    throw new Error("Missing ADMIN_SEED_USERNAME or ADMIN_SEED_PASSWORD in the environment.");
  }

  const adminPasswordHash = await hash(ADMIN_SEED_PASSWORD, passwordOptions);

  await prisma.user.upsert({
    where: {
      username: ADMIN_SEED_USERNAME.trim().toLowerCase()
    },
    update: {
      firstName: "Sanjay",
      lastName: "Gulati",
      email: ADMIN_SEED_EMAIL,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "APPROVED",
      approvedAt: new Date()
    },
    create: {
      username: ADMIN_SEED_USERNAME.trim().toLowerCase(),
      firstName: "Sanjay",
      lastName: "Gulati",
      email: ADMIN_SEED_EMAIL,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "APPROVED",
      approvedAt: new Date()
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
