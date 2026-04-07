import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const sqlitePath = path.join(process.cwd(), "prisma", "dev.db");

function readTable(db, tableName) {
  return db.prepare(`SELECT * FROM "${tableName}"`).all();
}

function toDate(value) {
  return value ? new Date(value) : null;
}

function mapUser(user) {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    status: user.status,
    staffId: user.staffId,
    profileImageDataUrl: user.profileImageDataUrl,
    approvedAt: toDate(user.approvedAt),
    approvedById: null,
    lastLoginAt: toDate(user.lastLoginAt),
    createdAt: toDate(user.createdAt),
    updatedAt: toDate(user.updatedAt)
  };
}

async function clearTargetDatabase() {
  await prisma.auditLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.counter.deleteMany();
}

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    throw new Error("DATABASE_URL must point to the live Postgres database before importing.");
  }

  if (!fs.existsSync(sqlitePath)) {
    throw new Error(`SQLite source database not found at ${sqlitePath}`);
  }

  const sqliteDb = new DatabaseSync(sqlitePath, { readonly: true });

  try {
    const counters = readTable(sqliteDb, "Counter");
    const users = readTable(sqliteDb, "User");
    const sessions = readTable(sqliteDb, "Session");
    const passwordResetTokens = readTable(sqliteDb, "PasswordResetToken");
    const attendanceRecords = readTable(sqliteDb, "Attendance");
    const tasks = readTable(sqliteDb, "Task");
    const auditLogs = readTable(sqliteDb, "AuditLog");

    await clearTargetDatabase();

    if (counters.length > 0) {
      await prisma.counter.createMany({
        data: counters.map((counter) => ({
          key: counter.key,
          value: counter.value,
          updatedAt: toDate(counter.updatedAt)
        }))
      });
    }

    if (users.length > 0) {
      const usersByRole = [...users].sort((left, right) => (left.role === "ADMIN" ? -1 : right.role === "ADMIN" ? 1 : 0));

      await prisma.user.createMany({
        data: usersByRole.map(mapUser)
      });

      for (const user of usersByRole) {
        if (!user.approvedById) {
          continue;
        }

        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            approvedById: user.approvedById
          }
        });
      }
    }

    if (sessions.length > 0) {
      await prisma.session.createMany({
        data: sessions.map((session) => ({
          id: session.id,
          userId: session.userId,
          sessionTokenHash: session.sessionTokenHash,
          expiresAt: toDate(session.expiresAt),
          createdAt: toDate(session.createdAt)
        }))
      });
    }

    if (passwordResetTokens.length > 0) {
      await prisma.passwordResetToken.createMany({
        data: passwordResetTokens.map((token) => ({
          id: token.id,
          userId: token.userId,
          tokenHash: token.tokenHash,
          expiresAt: toDate(token.expiresAt),
          usedAt: toDate(token.usedAt),
          createdAt: toDate(token.createdAt)
        }))
      });
    }

    if (attendanceRecords.length > 0) {
      await prisma.attendance.createMany({
        data: attendanceRecords.map((record) => ({
          id: record.id,
          userId: record.userId,
          workDateKey: record.workDateKey,
          clockInAt: toDate(record.clockInAt),
          clockOutAt: toDate(record.clockOutAt),
          status: record.status,
          expectedClockIn: record.expectedClockIn,
          expectedClockOut: record.expectedClockOut,
          note: record.note,
          createdAt: toDate(record.createdAt),
          updatedAt: toDate(record.updatedAt)
        }))
      });
    }

    if (tasks.length > 0) {
      await prisma.task.createMany({
        data: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: toDate(task.dueDate),
          assignedToUserId: task.assignedToUserId,
          createdByUserId: task.createdByUserId,
          completedAt: toDate(task.completedAt),
          createdAt: toDate(task.createdAt),
          updatedAt: toDate(task.updatedAt)
        }))
      });
    }

    if (auditLogs.length > 0) {
      await prisma.auditLog.createMany({
        data: auditLogs.map((log) => ({
          id: log.id,
          actorUserId: log.actorUserId,
          targetUserId: log.targetUserId,
          action: log.action,
          metadata: log.metadata,
          createdAt: toDate(log.createdAt)
        }))
      });
    }

    console.log(
      JSON.stringify(
        {
          imported: {
            counters: counters.length,
            users: users.length,
            sessions: sessions.length,
            passwordResetTokens: passwordResetTokens.length,
            attendanceRecords: attendanceRecords.length,
            tasks: tasks.length,
            auditLogs: auditLogs.length
          }
        },
        null,
        2
      )
    );
  } finally {
    sqliteDb.close();
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
