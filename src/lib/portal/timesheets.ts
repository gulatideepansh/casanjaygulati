import { AccountStatus, UserRole } from "@prisma/client";

import { getDb } from "@/lib/db";

import {
  EXPECTED_CLOCK_IN_HOUR,
  EXPECTED_CLOCK_IN_MINUTE,
  EXPECTED_CLOCK_OUT_HOUR,
  EXPECTED_CLOCK_OUT_MINUTE,
  PORTAL_TIMEZONE
} from "./config";
import {
  formatPortalDate,
  getPortalDateKey,
  getPortalDateValue,
  getPortalMinutes
} from "./time";

const DAY_IN_MS = 86400000;
const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7
};

export type TimesheetEntryDraft = {
  workDate: Date;
  clockInAt: Date | null;
  clockOutAt: Date | null;
  attendanceStatus: string;
  workedMinutes: number;
};

export type WeeklySummaryDraft = {
  totalDaysWorked: number;
  totalMinutesWorked: number;
  lateCount: number;
  earlyClockOutCount: number;
  missedClockOutCount: number;
  statusSummary: string;
};

export type WorkWeekRange = {
  weekStartDate: Date;
  weekEndDate: Date;
  weekStartKey: string;
  weekEndKey: string;
};

export type WeeklyTimesheetDraft = WeeklySummaryDraft & {
  entries: TimesheetEntryDraft[];
};

export type WeeklyTimesheetUpsertResult = {
  created: boolean;
  refreshed: boolean;
  timesheetId: string;
  userId: string;
};

export type EditableWeeklyTimesheetEntryInput = {
  id: string;
  workDate: Date;
  attendanceStatus: string;
  clockInAt: Date | null;
  clockOutAt: Date | null;
  workedMinutes: number;
};

function getPortalWeekdayIndex(date = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: PORTAL_TIMEZONE,
    weekday: "short"
  }).format(date);

  return WEEKDAY_INDEX[weekday] ?? 1;
}

function addPortalDays(date: Date, days: number) {
  return new Date(getPortalDateValue(date) + days * DAY_IN_MS);
}

function getPortalMidnight(date = new Date()) {
  return new Date(getPortalDateValue(date));
}

function getWorkedMinutes(clockInAt: Date, clockOutAt: Date | null) {
  if (!clockOutAt) {
    return 0;
  }

  return Math.max(0, Math.round((clockOutAt.getTime() - clockInAt.getTime()) / 60000));
}

function isLate(clockInAt: Date | null) {
  if (!clockInAt) {
    return false;
  }

  return getPortalMinutes(clockInAt) > EXPECTED_CLOCK_IN_HOUR * 60 + EXPECTED_CLOCK_IN_MINUTE;
}

function isEarlyClockOut(clockOutAt: Date | null) {
  if (!clockOutAt) {
    return false;
  }

  return getPortalMinutes(clockOutAt) < EXPECTED_CLOCK_OUT_HOUR * 60 + EXPECTED_CLOCK_OUT_MINUTE;
}

function buildAttendanceStatusLabel({
  late,
  earlyClockOut,
  missedClockOut
}: {
  late: boolean;
  earlyClockOut: boolean;
  missedClockOut: boolean;
}) {
  if (missedClockOut) {
    return "Missed clock-out";
  }

  if (late && earlyClockOut) {
    return "Late and early clock-out";
  }

  if (late) {
    return "Late";
  }

  if (earlyClockOut) {
    return "Early clock-out";
  }

  return "On time";
}

function buildMissingAttendanceStatus(workDate: Date, referenceDate: Date) {
  const workDateValue = getPortalDateValue(workDate);
  const referenceDateValue = getPortalDateValue(referenceDate);

  if (workDateValue > referenceDateValue) {
    return "Not started";
  }

  if (workDateValue === referenceDateValue) {
    return "Not started";
  }

  return "Absent";
}

function isWorkedDay(entry: { attendanceStatus: string; clockInAt: Date | null; workedMinutes: number }) {
  if (entry.clockInAt || entry.workedMinutes > 0) {
    return true;
  }

  const normalizedStatus = entry.attendanceStatus.trim().toLowerCase();
  return normalizedStatus.length > 0 && normalizedStatus !== "absent" && normalizedStatus !== "not started";
}

function buildStatusSummary(entries: TimesheetEntryDraft[]) {
  const absentCount = entries.filter((entry) => entry.attendanceStatus.toLowerCase() === "absent").length;
  const lateCount = entries.filter((entry) => entry.attendanceStatus.toLowerCase().includes("late")).length;
  const earlyClockOutCount = entries.filter((entry) =>
    entry.attendanceStatus.toLowerCase().includes("early clock-out")
  ).length;
  const missedClockOutCount = entries.filter((entry) =>
    entry.attendanceStatus.toLowerCase().includes("missed clock-out")
  ).length;

  const summaryParts: string[] = [];

  if (absentCount > 0) {
    summaryParts.push(`${absentCount} absent`);
  }

  if (lateCount > 0) {
    summaryParts.push(`${lateCount} late`);
  }

  if (earlyClockOutCount > 0) {
    summaryParts.push(`${earlyClockOutCount} early clock-out`);
  }

  if (missedClockOutCount > 0) {
    summaryParts.push(`${missedClockOutCount} missed clock-out`);
  }

  return summaryParts.length > 0 ? summaryParts.join(" | ") : "Complete week recorded";
}

function buildWeeklySummary(entries: TimesheetEntryDraft[]): WeeklySummaryDraft {
  return {
    totalDaysWorked: entries.filter(isWorkedDay).length,
    totalMinutesWorked: entries.reduce((total, entry) => total + Math.max(0, entry.workedMinutes), 0),
    lateCount: entries.filter((entry) => entry.attendanceStatus.toLowerCase().includes("late")).length,
    earlyClockOutCount: entries.filter((entry) =>
      entry.attendanceStatus.toLowerCase().includes("early clock-out")
    ).length,
    missedClockOutCount: entries.filter((entry) =>
      entry.attendanceStatus.toLowerCase().includes("missed clock-out")
    ).length,
    statusSummary: buildStatusSummary(entries)
  };
}

function buildTimesheetEntryDraft({
  workDate,
  attendanceRecord,
  referenceDate
}: {
  workDate: Date;
  attendanceRecord?:
    | {
        clockInAt: Date;
        clockOutAt: Date | null;
      }
    | undefined;
  referenceDate: Date;
}): TimesheetEntryDraft {
  if (!attendanceRecord) {
    return {
      workDate,
      clockInAt: null,
      clockOutAt: null,
      attendanceStatus: buildMissingAttendanceStatus(workDate, referenceDate),
      workedMinutes: 0
    };
  }

  const late = isLate(attendanceRecord.clockInAt);
  const earlyClockOut = isEarlyClockOut(attendanceRecord.clockOutAt);
  const missedClockOut = !attendanceRecord.clockOutAt;

  return {
    workDate,
    clockInAt: attendanceRecord.clockInAt,
    clockOutAt: attendanceRecord.clockOutAt,
    attendanceStatus: buildAttendanceStatusLabel({
      late,
      earlyClockOut,
      missedClockOut
    }),
    workedMinutes: getWorkedMinutes(attendanceRecord.clockInAt, attendanceRecord.clockOutAt)
  };
}

function createWorkWeekRange(weekStartDate: Date, weekEndDate: Date): WorkWeekRange {
  return {
    weekStartDate,
    weekEndDate,
    weekStartKey: getPortalDateKey(weekStartDate),
    weekEndKey: getPortalDateKey(weekEndDate)
  };
}

export function getMostRecentClosedWorkWeek(referenceDate = new Date()): WorkWeekRange {
  const weekdayIndex = getPortalWeekdayIndex(referenceDate);
  const daysBackToClosedSaturday = weekdayIndex === 7 ? 1 : weekdayIndex + 1;
  const weekEndDate = addPortalDays(getPortalMidnight(referenceDate), -daysBackToClosedSaturday);
  const weekStartDate = addPortalDays(weekEndDate, -5);

  return createWorkWeekRange(weekStartDate, weekEndDate);
}

export function getCurrentWorkWeek(referenceDate = new Date()): WorkWeekRange {
  const weekdayIndex = getPortalWeekdayIndex(referenceDate);

  if (weekdayIndex === 7) {
    return getMostRecentClosedWorkWeek(referenceDate);
  }

  const weekStartDate = addPortalDays(getPortalMidnight(referenceDate), -(weekdayIndex - 1));
  const weekEndDate = addPortalDays(weekStartDate, 5);

  return createWorkWeekRange(weekStartDate, weekEndDate);
}

export function enumerateWorkWeekDates(range: WorkWeekRange) {
  return Array.from({ length: 6 }, (_, index) => addPortalDays(range.weekStartDate, index));
}

export function formatWorkWeekLabel(range: { weekStartDate: Date; weekEndDate: Date }) {
  return `${formatPortalDate(range.weekStartDate)} - ${formatPortalDate(range.weekEndDate)}`;
}

export function formatWorkedMinutesLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

async function createTimesheetAuditLog({
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

function buildDraftFromAttendanceMap(
  attendanceByDateKey: Map<string, { clockInAt: Date; clockOutAt: Date | null }>,
  range: WorkWeekRange,
  referenceDate: Date
): WeeklyTimesheetDraft {
  const entries = enumerateWorkWeekDates(range).map((workDate) =>
    buildTimesheetEntryDraft({
      workDate,
      attendanceRecord: attendanceByDateKey.get(getPortalDateKey(workDate)),
      referenceDate
    })
  );

  return {
    entries,
    ...buildWeeklySummary(entries)
  };
}

async function upsertWeeklyTimesheetForUser({
  userId,
  range,
  attendanceByDateKey,
  referenceDate,
  force,
  generatedAt
}: {
  userId: string;
  range: WorkWeekRange;
  attendanceByDateKey: Map<string, { clockInAt: Date; clockOutAt: Date | null }>;
  referenceDate: Date;
  force: boolean;
  generatedAt: Date;
}): Promise<WeeklyTimesheetUpsertResult> {
  const db = getDb();
  const draft = buildDraftFromAttendanceMap(attendanceByDateKey, range, referenceDate);

  return db.$transaction(async (tx) => {
    const existingTimesheet = await tx.weeklyTimesheet.findUnique({
      where: {
        userId_weekStartDate_weekEndDate: {
          userId,
          weekStartDate: range.weekStartDate,
          weekEndDate: range.weekEndDate
        }
      },
      select: {
        id: true,
        notes: true
      }
    });

    if (existingTimesheet && !force) {
      return {
        created: false,
        refreshed: false,
        timesheetId: existingTimesheet.id,
        userId
      };
    }

    if (existingTimesheet) {
      await tx.weeklyTimesheetEntry.deleteMany({
        where: {
          timesheetId: existingTimesheet.id
        }
      });

      const updatedTimesheet = await tx.weeklyTimesheet.update({
        where: {
          id: existingTimesheet.id
        },
        data: {
          generatedAt,
          totalDaysWorked: draft.totalDaysWorked,
          totalMinutesWorked: draft.totalMinutesWorked,
          lateCount: draft.lateCount,
          earlyClockOutCount: draft.earlyClockOutCount,
          missedClockOutCount: draft.missedClockOutCount,
          statusSummary: draft.statusSummary,
          notes: existingTimesheet.notes,
          entries: {
            create: draft.entries
          }
        }
      });

      return {
        created: false,
        refreshed: true,
        timesheetId: updatedTimesheet.id,
        userId
      };
    }

    const createdTimesheet = await tx.weeklyTimesheet.create({
      data: {
        userId,
        weekStartDate: range.weekStartDate,
        weekEndDate: range.weekEndDate,
        generatedAt,
        totalDaysWorked: draft.totalDaysWorked,
        totalMinutesWorked: draft.totalMinutesWorked,
        lateCount: draft.lateCount,
        earlyClockOutCount: draft.earlyClockOutCount,
        missedClockOutCount: draft.missedClockOutCount,
        statusSummary: draft.statusSummary,
        entries: {
          create: draft.entries
        }
      }
    });

    return {
      created: true,
      refreshed: false,
      timesheetId: createdTimesheet.id,
      userId
    };
  });
}

export async function generateWeeklyTimesheetsForWeek({
  range = getMostRecentClosedWorkWeek(),
  force = false,
  actorUserId,
  source = "manual"
}: {
  range?: WorkWeekRange;
  force?: boolean;
  actorUserId?: string;
  source?: "manual" | "cron";
} = {}) {
  const db = getDb();
  const generatedAt = new Date();

  const staffUsers = await db.user.findMany({
    where: {
      role: UserRole.STAFF,
      status: AccountStatus.APPROVED
    },
    select: {
      id: true
    }
  });

  if (staffUsers.length === 0) {
    return {
      createdCount: 0,
      refreshedCount: 0,
      skippedCount: 0,
      results: [] as WeeklyTimesheetUpsertResult[]
    };
  }

  const attendanceRecords = await db.attendance.findMany({
    where: {
      userId: {
        in: staffUsers.map((staffUser) => staffUser.id)
      },
      workDateKey: {
        gte: range.weekStartKey,
        lte: range.weekEndKey
      }
    },
    select: {
      userId: true,
      workDateKey: true,
      clockInAt: true,
      clockOutAt: true
    }
  });

  const attendanceByUser = new Map<string, Map<string, { clockInAt: Date; clockOutAt: Date | null }>>();

  for (const attendanceRecord of attendanceRecords) {
    const existingMap = attendanceByUser.get(attendanceRecord.userId) ?? new Map<string, { clockInAt: Date; clockOutAt: Date | null }>();
    existingMap.set(attendanceRecord.workDateKey, {
      clockInAt: attendanceRecord.clockInAt,
      clockOutAt: attendanceRecord.clockOutAt
    });
    attendanceByUser.set(attendanceRecord.userId, existingMap);
  }

  const results = await Promise.all(
    staffUsers.map((staffUser) =>
      upsertWeeklyTimesheetForUser({
        userId: staffUser.id,
        range,
        attendanceByDateKey: attendanceByUser.get(staffUser.id) ?? new Map(),
        referenceDate: generatedAt,
        force,
        generatedAt
      })
    )
  );

  const createdCount = results.filter((result) => result.created).length;
  const refreshedCount = results.filter((result) => result.refreshed).length;
  const skippedCount = results.length - createdCount - refreshedCount;

  await createTimesheetAuditLog({
    actorUserId,
    action: source === "cron" ? "timesheet.generated.cron" : force ? "timesheet.generated.refresh" : "timesheet.generated.manual",
    metadata: {
      weekStartDate: range.weekStartKey,
      weekEndDate: range.weekEndKey,
      createdCount,
      refreshedCount,
      skippedCount
    }
  });

  return {
    createdCount,
    refreshedCount,
    skippedCount,
    results
  };
}

export async function regenerateWeeklyTimesheet(timesheetId: string, actorUserId?: string) {
  const existingTimesheet = await getDb().weeklyTimesheet.findUnique({
    where: {
      id: timesheetId
    },
    select: {
      id: true,
      userId: true,
      weekStartDate: true,
      weekEndDate: true
    }
  });

  if (!existingTimesheet) {
    return null;
  }

  const result = await generateWeeklyTimesheetsForWeek({
    range: createWorkWeekRange(existingTimesheet.weekStartDate, existingTimesheet.weekEndDate),
    force: true,
    actorUserId,
    source: "manual"
  });

  return result.results.find((item) => item.timesheetId === existingTimesheet.id) ?? null;
}

export async function buildLiveWeeklyPreviewForUser(userId: string, referenceDate = new Date()) {
  const range = getCurrentWorkWeek(referenceDate);
  const attendanceRecords = await getDb().attendance.findMany({
    where: {
      userId,
      workDateKey: {
        gte: range.weekStartKey,
        lte: range.weekEndKey
      }
    },
    select: {
      workDateKey: true,
      clockInAt: true,
      clockOutAt: true
    }
  });

  const attendanceByDateKey = new Map(
    attendanceRecords.map((attendanceRecord) => [
      attendanceRecord.workDateKey,
      {
        clockInAt: attendanceRecord.clockInAt,
        clockOutAt: attendanceRecord.clockOutAt
      }
    ])
  );

  return {
    range,
    ...buildDraftFromAttendanceMap(attendanceByDateKey, range, referenceDate)
  };
}

export async function updateWeeklyTimesheetFromAdminInput({
  timesheetId,
  notes,
  entries,
  actorUserId
}: {
  timesheetId: string;
  notes: string;
  entries: EditableWeeklyTimesheetEntryInput[];
  actorUserId: string;
}) {
  const existingTimesheet = await getDb().weeklyTimesheet.findUnique({
    where: {
      id: timesheetId
    },
    select: {
      id: true,
      userId: true,
      entries: {
        select: {
          id: true
        }
      }
    }
  });

  if (!existingTimesheet) {
    return null;
  }

  const existingEntryIds = new Set(existingTimesheet.entries.map((entry) => entry.id));
  const normalizedEntries = entries
    .filter((entry) => existingEntryIds.has(entry.id))
    .map<TimesheetEntryDraft>((entry) => ({
      workDate: entry.workDate,
      clockInAt: entry.clockInAt,
      clockOutAt: entry.clockOutAt,
      attendanceStatus: entry.attendanceStatus.trim() || "Absent",
      workedMinutes:
        entry.workedMinutes > 0
          ? entry.workedMinutes
          : entry.clockInAt
            ? getWorkedMinutes(entry.clockInAt, entry.clockOutAt)
            : 0
    }))
    .sort((leftEntry, rightEntry) => leftEntry.workDate.getTime() - rightEntry.workDate.getTime());

  const summary = buildWeeklySummary(normalizedEntries);

  await getDb().$transaction(async (tx) => {
    for (const entry of entries) {
      if (!existingEntryIds.has(entry.id)) {
        continue;
      }

      await tx.weeklyTimesheetEntry.update({
        where: {
          id: entry.id
        },
        data: {
          attendanceStatus: entry.attendanceStatus.trim() || "Absent",
          clockInAt: entry.clockInAt,
          clockOutAt: entry.clockOutAt,
          workedMinutes:
            entry.workedMinutes > 0
              ? entry.workedMinutes
              : entry.clockInAt
                ? getWorkedMinutes(entry.clockInAt, entry.clockOutAt)
                : 0
        }
      });
    }

    await tx.weeklyTimesheet.update({
      where: {
        id: timesheetId
      },
      data: {
        notes: notes.trim() || null,
        totalDaysWorked: summary.totalDaysWorked,
        totalMinutesWorked: summary.totalMinutesWorked,
        lateCount: summary.lateCount,
        earlyClockOutCount: summary.earlyClockOutCount,
        missedClockOutCount: summary.missedClockOutCount,
        statusSummary: summary.statusSummary
      }
    });
  });

  await createTimesheetAuditLog({
    actorUserId,
    targetUserId: existingTimesheet.userId,
    action: "timesheet.updated",
    metadata: {
      timesheetId,
      updatedEntryCount: normalizedEntries.length
    }
  });

  return {
    ...summary,
    notes: notes.trim()
  };
}
