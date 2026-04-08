"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { portalDateTimeInputToDate } from "@/lib/portal/time";
import {
  generateWeeklyTimesheetsForWeek,
  getMostRecentClosedWorkWeek,
  regenerateWeeklyTimesheet,
  updateWeeklyTimesheetFromAdminInput
} from "@/lib/portal/timesheets";

export async function generateLatestTimesheetsAction() {
  const adminUser = await requireAdmin();

  await generateWeeklyTimesheetsForWeek({
    range: getMostRecentClosedWorkWeek(),
    actorUserId: adminUser.id,
    source: "manual"
  });

  revalidatePath("/portal/timesheets");
  revalidatePath("/portal/dashboard");
}

export async function refreshWeeklyTimesheetAction(formData: FormData) {
  const adminUser = await requireAdmin();
  const timesheetId = formData.get("timesheetId");

  if (typeof timesheetId !== "string" || timesheetId.length === 0) {
    return;
  }

  await regenerateWeeklyTimesheet(timesheetId, adminUser.id);

  revalidatePath("/portal/timesheets");
  revalidatePath("/portal/dashboard");
}

export async function updateWeeklyTimesheetAction(formData: FormData) {
  const adminUser = await requireAdmin();
  const timesheetId = formData.get("timesheetId");
  const notes = formData.get("notes");
  const entryIds = formData.getAll("entryId");
  const workDates = formData.getAll("workDate");
  const attendanceStatuses = formData.getAll("attendanceStatus");
  const clockIns = formData.getAll("clockInAt");
  const clockOuts = formData.getAll("clockOutAt");
  const workedMinutes = formData.getAll("workedMinutes");

  if (typeof timesheetId !== "string" || timesheetId.length === 0) {
    return;
  }

  if (
    entryIds.length !== workDates.length ||
    entryIds.length !== attendanceStatuses.length ||
    entryIds.length !== clockIns.length ||
    entryIds.length !== clockOuts.length ||
    entryIds.length !== workedMinutes.length
  ) {
    return;
  }

  const parsedEntries = entryIds.flatMap((entryId, index) => {
    const workDate = workDates[index];
    const attendanceStatus = attendanceStatuses[index];
    const clockInAt = clockIns[index];
    const clockOutAt = clockOuts[index];
    const workedMinutesValue = workedMinutes[index];

    if (typeof entryId !== "string" || typeof workDate !== "string" || typeof attendanceStatus !== "string") {
      return [];
    }

    const parsedWorkDate = new Date(workDate);
    const parsedClockInAt =
      typeof clockInAt === "string" && clockInAt.length > 0 ? portalDateTimeInputToDate(clockInAt) : null;
    const parsedClockOutAt =
      typeof clockOutAt === "string" && clockOutAt.length > 0 ? portalDateTimeInputToDate(clockOutAt) : null;
    const parsedWorkedMinutes =
      typeof workedMinutesValue === "string" && workedMinutesValue.trim().length > 0
        ? Number.parseInt(workedMinutesValue, 10)
        : 0;

    if (Number.isNaN(parsedWorkDate.getTime())) {
      return [];
    }

    if (parsedClockInAt && Number.isNaN(parsedClockInAt.getTime())) {
      return [];
    }

    if (parsedClockOutAt && Number.isNaN(parsedClockOutAt.getTime())) {
      return [];
    }

    return [
      {
        id: entryId,
        workDate: parsedWorkDate,
        attendanceStatus,
        clockInAt: parsedClockInAt,
        clockOutAt: parsedClockOutAt,
        workedMinutes: Number.isNaN(parsedWorkedMinutes) ? 0 : Math.max(0, parsedWorkedMinutes)
      }
    ];
  });

  await updateWeeklyTimesheetFromAdminInput({
    timesheetId,
    notes: typeof notes === "string" ? notes : "",
    entries: parsedEntries,
    actorUserId: adminUser.id
  });

  revalidatePath("/portal/timesheets");
  revalidatePath("/portal/dashboard");
}
