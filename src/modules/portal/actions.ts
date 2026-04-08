"use server";

import { AccountStatus, TaskStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin, requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getPortalClockInStatus, getPortalClockOutStatus, getPortalDateKey, portalDateInputToDate } from "@/lib/portal/time";
import type { AuthActionState } from "@/modules/auth/form-state";

import { createTaskSchema, updateTaskStatusSchema } from "./validation";

function buildTaskState(
  message: string,
  status: "error" | "success",
  fieldErrors?: Record<string, string[] | undefined>
): AuthActionState {
  return {
    status,
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

export async function dismissActivityNotificationAction(auditLogId: string) {
  const adminUser = await requireAdmin();

  await getDb().auditLog.update({
    where: {
      id: auditLogId
    },
    data: {
      dismissedAt: new Date(),
      dismissedById: adminUser.id
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/activity");
}

async function markMissedClockOuts(userId: string) {
  const todayKey = getPortalDateKey();

  await getDb().attendance.updateMany({
    where: {
      userId,
      clockOutAt: null,
      workDateKey: {
        not: todayKey
      }
    },
    data: {
      status: "MISSED_CLOCK_OUT"
    }
  });
}

export async function clockInAction() {
  const currentUser = await requireUser();

  if (currentUser.role !== UserRole.STAFF || currentUser.status !== AccountStatus.APPROVED) {
    return;
  }

  const now = new Date();
  const todayKey = getPortalDateKey(now);

  await markMissedClockOuts(currentUser.id);

  const existingAttendance = await getDb().attendance.findUnique({
    where: {
      userId_workDateKey: {
        userId: currentUser.id,
        workDateKey: todayKey
      }
    }
  });

  if (existingAttendance) {
    return;
  }

  const status = getPortalClockInStatus(now);

  await getDb().attendance.create({
    data: {
      userId: currentUser.id,
      workDateKey: todayKey,
      clockInAt: now,
      status
    }
  });

  await createAuditLog({
    actorUserId: currentUser.id,
    targetUserId: currentUser.id,
    action: "attendance.clock_in",
    metadata: {
      workDateKey: todayKey,
      status
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/activity");
}

export async function clockOutAction() {
  const currentUser = await requireUser();

  if (currentUser.role !== UserRole.STAFF || currentUser.status !== AccountStatus.APPROVED) {
    return;
  }

  const now = new Date();
  const todayKey = getPortalDateKey(now);

  const existingAttendance = await getDb().attendance.findUnique({
    where: {
      userId_workDateKey: {
        userId: currentUser.id,
        workDateKey: todayKey
      }
    }
  });

  if (!existingAttendance || existingAttendance.clockOutAt) {
    return;
  }

  const status = getPortalClockOutStatus(now);

  await getDb().attendance.update({
    where: {
      id: existingAttendance.id
    },
    data: {
      clockOutAt: now,
      status
    }
  });

  await createAuditLog({
    actorUserId: currentUser.id,
    targetUserId: currentUser.id,
    action: "attendance.clock_out",
    metadata: {
      workDateKey: todayKey,
      status
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/activity");
}

export async function assignTaskAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const adminUser = await requireAdmin();
  const parsedInput = createTaskSchema.safeParse({
    assignedToUserId: formData.get("assignedToUserId"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate")
  });

  if (!parsedInput.success) {
    return buildTaskState("Please correct the task details and try again.", "error", parsedInput.error.flatten().fieldErrors);
  }

  const assignedUser = await getDb().user.findFirst({
    where: {
      id: parsedInput.data.assignedToUserId,
      role: UserRole.STAFF,
      status: AccountStatus.APPROVED
    }
  });

  if (!assignedUser) {
    return buildTaskState("That staff member could not be found.", "error");
  }

  const dueDate = portalDateInputToDate(parsedInput.data.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return buildTaskState("Please enter a valid due date.", "error", {
      dueDate: ["Please enter a valid due date."]
    });
  }

  const createdTask = await getDb().task.create({
    data: {
      assignedToUserId: assignedUser.id,
      createdByUserId: adminUser.id,
      title: parsedInput.data.title,
      description: parsedInput.data.description,
      priority: parsedInput.data.priority,
      dueDate
    }
  });

  await createAuditLog({
    actorUserId: adminUser.id,
    targetUserId: assignedUser.id,
    action: "task.assigned",
    metadata: {
      taskId: createdTask.id,
      title: createdTask.title,
      priority: createdTask.priority
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/tasks");
  revalidatePath("/portal/activity");

  return buildTaskState(`Task assigned to ${assignedUser.firstName} ${assignedUser.lastName}.`, "success");
}

export async function updateTaskStatusAction(formData: FormData) {
  const currentUser = await requireUser();
  const parsedInput = updateTaskStatusSchema.safeParse({
    taskId: formData.get("taskId"),
    status: formData.get("status")
  });

  if (!parsedInput.success) {
    return;
  }

  const task = await getDb().task.findUnique({
    where: {
      id: parsedInput.data.taskId
    }
  });

  if (!task || task.assignedToUserId !== currentUser.id) {
    return;
  }

  const status = parsedInput.data.status as TaskStatus;

  await getDb().task.update({
    where: {
      id: task.id
    },
    data: {
      status,
      completedAt: status === TaskStatus.COMPLETED ? new Date() : null
    }
  });

  await createAuditLog({
    actorUserId: currentUser.id,
    targetUserId: currentUser.id,
    action: "task.status_updated",
    metadata: {
      taskId: task.id,
      status
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/tasks");
  revalidatePath("/portal/activity");
}

export async function deleteTaskAction(formData: FormData) {
  const adminUser = await requireAdmin();
  const taskId = formData.get("taskId");

  if (typeof taskId !== "string" || taskId.length === 0) {
    return;
  }

  const task = await getDb().task.findUnique({
    where: {
      id: taskId
    },
    include: {
      assignedTo: true
    }
  });

  if (!task) {
    return;
  }

  await getDb().task.delete({
    where: {
      id: task.id
    }
  });

  await createAuditLog({
    actorUserId: adminUser.id,
    targetUserId: task.assignedToUserId,
    action: "task.deleted",
    metadata: {
      taskId: task.id,
      title: task.title,
      priority: task.priority
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/tasks");
  revalidatePath("/portal/activity");
}
