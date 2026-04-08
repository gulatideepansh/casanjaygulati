import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { portalDateTimeInputToDate } from "@/lib/portal/time";
import { updateWeeklyTimesheetFromAdminInput } from "@/lib/portal/timesheets";

function buildRedirectUrl(request: Request, redirectTo?: FormDataEntryValue | null) {
  const target =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : "/portal/timesheets";

  return new URL(target, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ timesheetId: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/portal/sign-in", request.url));
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  const { timesheetId } = await params;
  const formData = await request.formData();
  const notes = formData.get("notes");
  const entryIds = formData.getAll("entryId");
  const workDates = formData.getAll("workDate");
  const attendanceStatuses = formData.getAll("attendanceStatus");
  const clockIns = formData.getAll("clockInAt");
  const clockOuts = formData.getAll("clockOutAt");
  const workedMinutes = formData.getAll("workedMinutes");

  if (
    entryIds.length !== workDates.length ||
    entryIds.length !== attendanceStatuses.length ||
    entryIds.length !== clockIns.length ||
    entryIds.length !== clockOuts.length ||
    entryIds.length !== workedMinutes.length
  ) {
    return NextResponse.redirect(buildRedirectUrl(request, formData.get("redirectTo")), {
      status: 303
    });
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
    actorUserId: currentUser.id
  });

  revalidatePath("/portal/timesheets");
  revalidatePath("/portal/dashboard");

  return NextResponse.redirect(buildRedirectUrl(request, formData.get("redirectTo")), {
    status: 303
  });
}
