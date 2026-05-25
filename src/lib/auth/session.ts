import { AccountStatus, UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";

import { SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "./config";
import { createOpaqueToken, sha256 } from "./crypto";

export async function createUserSession(userId: string) {
  const sessionToken = createOpaqueToken();
  const sessionTokenHash = sha256(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await getDb().session.create({
    data: {
      userId,
      sessionTokenHash,
      expiresAt
    }
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const currentCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (currentCookie?.value) {
    await getDb().session.deleteMany({
      where: {
        sessionTokenHash: sha256(currentCookie.value)
      }
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const currentCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!currentCookie?.value) {
    return null;
  }

  let activeSession;

  try {
    activeSession = await getDb().session.findFirst({
      where: {
        sessionTokenHash: sha256(currentCookie.value),
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });
  } catch (error) {
    console.error("[portal:session] Failed to read the current session.", error);
    return null;
  }

  if (!activeSession) {
    return null;
  }

  return activeSession.user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/portal/sign-in");
  }

  if (user.status !== AccountStatus.APPROVED) {
    redirect("/portal/sign-in");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== UserRole.ADMIN) {
    redirect("/portal/dashboard");
  }

  return user;
}
