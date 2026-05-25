"use server";

import { Prisma, AccountStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { APP_BASE_URL, PASSWORD_RESET_DURATION_MS } from "@/lib/auth/config";
import { createOpaqueToken, sha256 } from "@/lib/auth/crypto";
import { sendPasswordResetEmail } from "@/lib/auth/mail";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession, deleteCurrentSession, requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

import {
  PROFILE_IMAGE_MIME_TYPES,
  PROFILE_IMAGE_SIZE_LIMIT,
  forgotPasswordSchema,
  normalizeIdentifier,
  resetPasswordSchema,
  signInSchema,
  staffAccountSchema
} from "./validation";
import type { AuthActionState } from "./form-state";

function buildErrorState(message: string, fieldErrors?: Record<string, string[] | undefined>) {
  return {
    status: "error" as const,
    message,
    fieldErrors
  };
}

async function createAuditLog({
  actorUserId,
  targetUserId,
  action,
  metadata
}: {
  actorUserId?: string;
  targetUserId?: string;
  action: string;
  metadata?: Record<string, unknown>;
}) {
  await getDb().auditLog.create({
    data: {
      actorUserId,
      targetUserId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null
    }
  });
}

async function resolveProfileImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (!PROFILE_IMAGE_MIME_TYPES.includes(file.type)) {
    throw new Error("Profile picture must be a JPG, PNG, or WEBP image.");
  }

  if (file.size > PROFILE_IMAGE_SIZE_LIMIT) {
    throw new Error("Profile picture must be 2 MB or smaller.");
  }

  const imageBuffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${imageBuffer.toString("base64")}`;
}

async function getNextStaffId(tx: Prisma.TransactionClient) {
  const counter = await tx.counter.upsert({
    where: {
      key: "staffId"
    },
    update: {
      value: {
        increment: 1
      }
    },
    create: {
      key: "staffId",
      value: 1
    }
  });

  return `STF${counter.value.toString().padStart(5, "0")}`;
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsedInput = signInSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password")
  });

  if (!parsedInput.success) {
    return buildErrorState("Please check the highlighted fields.", parsedInput.error.flatten().fieldErrors);
  }

  const identifier = normalizeIdentifier(parsedInput.data.identifier);
  try {
    const user = await getDb().user.findFirst({
      where: {
        OR: [
          {
            username: identifier
          },
          {
            email: identifier
          }
        ]
      }
    });

    if (!user) {
      return buildErrorState("We could not find an account with those credentials.");
    }

    if (user.status !== AccountStatus.APPROVED) {
      return buildErrorState("This staff account is inactive. Please contact the administrator.");
    }

    const passwordMatches = await verifyPassword(user.passwordHash, parsedInput.data.password);

    if (!passwordMatches) {
      return buildErrorState("We could not find an account with those credentials.");
    }

    await getDb().user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date()
      }
    });

    await createUserSession(user.id);
  } catch (error) {
    console.error("[portal:sign-in] Sign-in failed before redirect.", error);
    return buildErrorState("The staff portal is temporarily unavailable. Please try again shortly.");
  }

  redirect("/portal/dashboard");
}

export async function createStaffByAdminAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const adminUser = await requireAdmin();
  const parsedInput = staffAccountSchema.safeParse({
    username: formData.get("username"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsedInput.success) {
    return buildErrorState(
      "Please correct the staff details and try again.",
      parsedInput.error.flatten().fieldErrors
    );
  }

  let profileImageDataUrl: string | null = null;

  try {
    profileImageDataUrl = await resolveProfileImage(formData.get("profilePicture"));
  } catch (error) {
    return buildErrorState(error instanceof Error ? error.message : "Profile picture upload failed.");
  }

  const existingUser = await getDb().user.findFirst({
    where: {
      OR: [
        {
          username: parsedInput.data.username
        },
        {
          email: parsedInput.data.email
        }
      ]
    }
  });

  if (existingUser) {
    return buildErrorState("That username or email address is already in use.");
  }

  const passwordHash = await hashPassword(parsedInput.data.password);

  try {
    let createdStaffUserId = "";
    let createdStaffName = "";

    await getDb().$transaction(async (tx) => {
      const staffId = await getNextStaffId(tx);

      const createdStaffUser = await tx.user.create({
        data: {
          username: parsedInput.data.username,
          firstName: parsedInput.data.firstName,
          lastName: parsedInput.data.lastName,
          email: parsedInput.data.email,
          passwordHash,
          role: UserRole.STAFF,
          status: AccountStatus.APPROVED,
          staffId,
          profileImageDataUrl,
          approvedAt: new Date(),
          approvedById: adminUser.id
        }
      });

      createdStaffUserId = createdStaffUser.id;
      createdStaffName = `${createdStaffUser.firstName} ${createdStaffUser.lastName}`;
    });

    await createAuditLog({
      actorUserId: adminUser.id,
      targetUserId: createdStaffUserId,
      action: "staff.created",
      metadata: {
        staffName: createdStaffName,
        username: parsedInput.data.username
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return buildErrorState("That username or email address is already in use.");
    }

    return buildErrorState("We could not create the staff account right now.");
  }

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/staff");
  revalidatePath("/portal/activity");

  return {
    status: "success",
    message: "Staff account created successfully."
  };
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsedInput = forgotPasswordSchema.safeParse({
    email: formData.get("email")
  });

  if (!parsedInput.success) {
    return buildErrorState("Enter a valid email address.", parsedInput.error.flatten().fieldErrors);
  }

  const user = await getDb().user.findFirst({
    where: {
      email: parsedInput.data.email
    }
  });

  if (!user?.email) {
    return {
      status: "success",
      message: "If that email address exists, a password reset link has been sent."
    };
  }

  const resetToken = createOpaqueToken(24);
  const tokenHash = sha256(resetToken);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_DURATION_MS);

  await getDb().passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  const resetUrl = `${APP_BASE_URL.replace(/\/$/, "")}/portal/reset-password/${resetToken}`;
  const mailResult = await sendPasswordResetEmail({
    displayName: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    resetUrl
  });

  if (!mailResult.ok) {
    return buildErrorState(
      "Password reset email is not configured yet. Add SMTP settings before using forgot password on the live site."
    );
  }

  return {
    status: "success",
    message: "If that email address exists, a password reset link has been sent."
  };
}

export async function resetPasswordAction(
  resetToken: string,
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsedInput = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsedInput.success) {
    return buildErrorState("Please correct the highlighted fields.", parsedInput.error.flatten().fieldErrors);
  }

  const tokenHash = sha256(resetToken);
  const existingToken = await getDb().passwordResetToken.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: new Date()
      },
      usedAt: null
    }
  });

  if (!existingToken) {
    return buildErrorState("This reset link is invalid or has expired.");
  }

  const passwordHash = await hashPassword(parsedInput.data.password);

  await getDb().$transaction([
    getDb().user.update({
      where: {
        id: existingToken.userId
      },
      data: {
        passwordHash
      }
    }),
    getDb().passwordResetToken.update({
      where: {
        id: existingToken.id
      },
      data: {
        usedAt: new Date()
      }
    }),
    getDb().session.deleteMany({
      where: {
        userId: existingToken.userId
      }
    })
  ]);

  return {
    status: "success",
    message: "Your password has been updated. You can sign in now."
  };
}

export async function signOutAction() {
  await deleteCurrentSession();
  redirect("/portal/sign-in");
}

export async function deleteStaffAction(staffUserId: string) {
  const adminUser = await requireAdmin();
  const staffUser = await getDb().user.findUnique({
    where: {
      id: staffUserId
    }
  });

  if (!staffUser || staffUser.role !== UserRole.STAFF) {
    return;
  }

  if (staffUser.id === adminUser.id) {
    return;
  }

  await getDb().user.delete({
    where: {
      id: staffUserId
    }
  });

  await createAuditLog({
    actorUserId: adminUser.id,
    action: "staff.deleted",
    metadata: {
      staffName: `${staffUser.firstName} ${staffUser.lastName}`,
      username: staffUser.username,
      email: staffUser.email
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/staff");
  revalidatePath("/portal/tasks");
  revalidatePath("/portal/activity");
}

export async function deactivateStaffAction(staffUserId: string, formData: FormData) {
  const adminUser = await requireAdmin();
  const rawTenure = formData.get("tenure");
  const tenureLabel = typeof rawTenure === "string" ? rawTenure.trim() : "";

  if (!/^(0[1-9]|1[0-2])\/\d{4} to (0[1-9]|1[0-2])\/\d{4}$/.test(tenureLabel)) {
    return;
  }

  const staffUser = await getDb().user.findUnique({
    where: {
      id: staffUserId
    }
  });

  if (!staffUser || staffUser.role !== UserRole.STAFF) {
    return;
  }

  if (staffUser.id === adminUser.id) {
    return;
  }

  await getDb().$transaction(async (tx) => {
    await tx.deactivatedStaff.upsert({
      where: {
        originalUserId: staffUser.id
      },
      update: {
        username: staffUser.username,
        firstName: staffUser.firstName,
        lastName: staffUser.lastName,
        email: staffUser.email,
        staffId: staffUser.staffId,
        profileImageDataUrl: staffUser.profileImageDataUrl,
        role: staffUser.role,
        tenureLabel,
        joinedAt: staffUser.createdAt,
        lastLoginAt: staffUser.lastLoginAt,
        deactivatedAt: new Date(),
        deactivatedById: adminUser.id
      },
      create: {
        originalUserId: staffUser.id,
        username: staffUser.username,
        firstName: staffUser.firstName,
        lastName: staffUser.lastName,
        email: staffUser.email,
        staffId: staffUser.staffId,
        profileImageDataUrl: staffUser.profileImageDataUrl,
        role: staffUser.role,
        tenureLabel,
        joinedAt: staffUser.createdAt,
        lastLoginAt: staffUser.lastLoginAt,
        deactivatedById: adminUser.id
      }
    });

    await tx.user.update({
      where: {
        id: staffUser.id
      },
      data: {
        status: AccountStatus.DEACTIVATED
      }
    });

    await tx.session.deleteMany({
      where: {
        userId: staffUser.id
      }
    });

    await tx.passwordResetToken.deleteMany({
      where: {
        userId: staffUser.id
      }
    });
  });

  await createAuditLog({
    actorUserId: adminUser.id,
    action: "staff.deactivated",
    metadata: {
      staffName: `${staffUser.firstName} ${staffUser.lastName}`,
      username: staffUser.username,
      email: staffUser.email,
      tenure: tenureLabel
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/staff");
  revalidatePath("/portal/past-staff");
  revalidatePath("/portal/tasks");
  revalidatePath("/portal/activity");
}

export async function restoreStaffAction(archiveId: string, formData: FormData) {
  const adminUser = await requireAdmin();
  const archivedStaff = await getDb().deactivatedStaff.findUnique({
    where: {
      id: archiveId
    }
  });

  if (!archivedStaff) {
    return;
  }

  const existingUser =
    archivedStaff.originalUserId
      ? await getDb().user.findUnique({
          where: {
            id: archivedStaff.originalUserId
          }
        })
      : null;

  if (existingUser) {
    await getDb().$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: existingUser.id
        },
        data: {
          status: AccountStatus.APPROVED
        }
      });

      await tx.deactivatedStaff.delete({
        where: {
          id: archivedStaff.id
        }
      });
    });
  } else {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (typeof password !== "string" || typeof confirmPassword !== "string" || password.length < 8 || password !== confirmPassword) {
      return;
    }

    const passwordHash = await hashPassword(password);

    await getDb().$transaction(async (tx) => {
      const restoredUser = await tx.user.create({
        data: {
          username: archivedStaff.username,
          firstName: archivedStaff.firstName,
          lastName: archivedStaff.lastName,
          email: archivedStaff.email,
          passwordHash,
          role: UserRole.STAFF,
          status: AccountStatus.APPROVED,
          staffId: archivedStaff.staffId,
          profileImageDataUrl: archivedStaff.profileImageDataUrl,
          approvedAt: new Date(),
          approvedById: adminUser.id,
          lastLoginAt: archivedStaff.lastLoginAt,
          createdAt: archivedStaff.joinedAt ?? new Date()
        }
      });

      await tx.deactivatedStaff.delete({
        where: {
          id: archivedStaff.id
        }
      });

      await tx.auditLog.create({
        data: {
          actorUserId: adminUser.id,
          targetUserId: restoredUser.id,
          action: "staff.restored",
          metadata: JSON.stringify({
            staffName: `${archivedStaff.firstName} ${archivedStaff.lastName}`,
            username: archivedStaff.username,
            restoredFromArchiveId: archivedStaff.id
          })
        }
      });
    });

    revalidatePath("/portal/dashboard");
    revalidatePath("/portal/staff");
    revalidatePath("/portal/past-staff");
    revalidatePath("/portal/tasks");
    revalidatePath("/portal/activity");

    return;
  }

  await createAuditLog({
    actorUserId: adminUser.id,
    targetUserId: existingUser?.id,
    action: "staff.restored",
    metadata: {
      staffName: `${archivedStaff.firstName} ${archivedStaff.lastName}`,
      username: archivedStaff.username,
      restoredFromArchiveId: archivedStaff.id
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/staff");
  revalidatePath("/portal/past-staff");
  revalidatePath("/portal/tasks");
  revalidatePath("/portal/activity");
}
