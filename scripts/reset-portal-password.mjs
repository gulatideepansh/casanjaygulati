import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const passwordOptions = {
  algorithm: 2,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
  outputLen: 32
};

function createTemporaryPassword() {
  return randomBytes(18)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 20);
}

async function main() {
  const username = (process.argv[2] || process.env.RESET_USERNAME || "casanjaygulati").trim().toLowerCase();
  const suppliedPassword = process.env.RESET_PASSWORD;
  const newPassword = suppliedPassword || createTemporaryPassword();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Add it to .env/.env.local or pass it when running this script.");
  }

  if (!username) {
    throw new Error("Username is required.");
  }

  if (newPassword.length < 8) {
    throw new Error("RESET_PASSWORD must be at least 8 characters.");
  }

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!user) {
    throw new Error(`No portal user found with username "${username}".`);
  }

  const passwordHash = await hash(newPassword, passwordOptions);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        passwordHash
      }
    }),
    prisma.session.deleteMany({
      where: {
        userId: user.id
      }
    }),
    prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id
      }
    }),
    prisma.auditLog.create({
      data: {
        targetUserId: user.id,
        action: "PORTAL_PASSWORD_RESET_SCRIPT",
        metadata: JSON.stringify({
          username,
          resetAt: new Date().toISOString()
        })
      }
    })
  ]);

  console.log(`Password reset for "${username}". Existing sessions and password reset links were cleared.`);

  if (!suppliedPassword) {
    console.log(`Temporary password: ${newPassword}`);
    console.log("Sign in once, then change it to a private password.");
  }
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
