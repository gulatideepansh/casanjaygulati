import Link from "next/link";
import { AccountStatus, UserRole } from "@prisma/client";

import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import {
  formatPortalDate,
  formatPortalDateTime,
  formatPortalDateTimeInputValue,
  formatPortalTime,
  portalDateInputToDate
} from "@/lib/portal/time";
import {
  buildLiveWeeklyPreviewForUser,
  formatWorkWeekLabel,
  formatWorkedMinutesLabel
} from "@/lib/portal/timesheets";

export const metadata = {
  title: "Timesheets | Casanjaygulati"
};

function getFlagsLabel(timesheet: {
  lateCount: number;
  earlyClockOutCount: number;
  missedClockOutCount: number;
}) {
  return `${timesheet.lateCount} late | ${timesheet.earlyClockOutCount} early | ${timesheet.missedClockOutCount} missed`;
}

function buildTimesheetHref({
  timesheetId,
  week,
  staff
}: {
  timesheetId: string;
  week?: string;
  staff?: string;
}) {
  const params = new URLSearchParams();

  if (week) {
    params.set("week", week);
  }

  if (staff) {
    params.set("staff", staff);
  }

  params.set("timesheet", timesheetId);

  return `/portal/timesheets?${params.toString()}`;
}

function buildTimesheetsCollectionHref({
  week,
  staff
}: {
  week?: string;
  staff?: string;
}) {
  const params = new URLSearchParams();

  if (week) {
    params.set("week", week);
  }

  if (staff) {
    params.set("staff", staff);
  }

  const queryString = params.toString();
  return queryString.length > 0 ? `/portal/timesheets?${queryString}` : "/portal/timesheets";
}

export default async function TimesheetsPage({
  searchParams
}: {
  searchParams: Promise<{ week?: string; staff?: string; timesheet?: string }>;
}) {
  const currentUser = await requireUser();
  const resolvedSearchParams = await searchParams;
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const weekFilterDate =
    resolvedSearchParams.week && resolvedSearchParams.week.length > 0
      ? portalDateInputToDate(resolvedSearchParams.week)
      : null;
  const hasValidWeekFilter = weekFilterDate && !Number.isNaN(weekFilterDate.getTime());
  const staffSearchValue = resolvedSearchParams.staff?.trim() ?? "";
  const collectionHref = buildTimesheetsCollectionHref({
    week: resolvedSearchParams.week,
    staff: resolvedSearchParams.staff
  });

  const [staffMembers, timesheets, selectedTimesheet, livePreview] = await Promise.all([
    isAdmin
      ? getDb().user.findMany({
          where: {
            role: UserRole.STAFF,
            status: AccountStatus.APPROVED
          },
          orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        })
      : Promise.resolve([]),
    getDb().weeklyTimesheet.findMany({
      where: isAdmin
        ? {
            ...(hasValidWeekFilter
              ? {
                  weekStartDate: weekFilterDate
                }
              : {}),
            ...(staffSearchValue
              ? {
                  user: {
                    OR: [
                      {
                        firstName: {
                          contains: staffSearchValue,
                          mode: "insensitive"
                        }
                      },
                      {
                        lastName: {
                          contains: staffSearchValue,
                          mode: "insensitive"
                        }
                      },
                      {
                        username: {
                          contains: staffSearchValue,
                          mode: "insensitive"
                        }
                      },
                      {
                        staffId: {
                          contains: staffSearchValue,
                          mode: "insensitive"
                        }
                      }
                    ]
                  }
                }
              : {})
          }
        : {
            userId: currentUser.id
          },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            staffId: true
          }
        }
      },
      orderBy: [{ weekStartDate: "desc" }, { user: { firstName: "asc" } }, { user: { lastName: "asc" } }],
      take: 100
    }),
    resolvedSearchParams.timesheet
      ? getDb().weeklyTimesheet.findFirst({
          where: {
            id: resolvedSearchParams.timesheet,
            ...(isAdmin ? {} : { userId: currentUser.id })
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                staffId: true,
                email: true
              }
            },
            entries: {
              orderBy: {
                workDate: "asc"
              }
            }
          }
        })
      : Promise.resolve(null),
    !isAdmin ? buildLiveWeeklyPreviewForUser(currentUser.id) : Promise.resolve(null)
  ]);

  const activeTimesheet =
    selectedTimesheet ??
    (timesheets.length > 0
      ? await getDb().weeklyTimesheet.findUnique({
          where: {
            id: timesheets[0].id
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                staffId: true,
                email: true
              }
            },
            entries: {
              orderBy: {
                workDate: "asc"
              }
            }
          }
        })
      : null);

  return (
    <main className="section-shell py-10">
      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow={isAdmin ? "Timesheet Control" : "My Timesheets"}
            title={isAdmin ? "Weekly staff timesheets" : "Weekly timesheets"}
            description={
              isAdmin
                ? "Generate, review, edit, and export weekly staff timesheets from one place."
                : "Review your live work week and open any saved weekly timesheet."
            }
          />

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link href="/portal/dashboard" className="button-secondary">
              Back to Dashboard
            </Link>
            {isAdmin ? (
              <form action="/portal/timesheets/generate" method="post">
                <input type="hidden" name="redirectTo" value={collectionHref} />
                <button type="submit" className="button-primary">
                  Generate Latest Closed Week
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </section>

      {!isAdmin && livePreview ? (
        <section className="section-divider py-8">
          <div className="pt-10">
            <SectionHeading
              eyebrow="Current Work Week"
              title={formatWorkWeekLabel(livePreview.range)}
              description="This live preview updates from your attendance records before the weekly summary is formally generated."
            />

            <div className="mt-8 border-y border-white/10">
              <div className="grid gap-0 md:grid-cols-4">
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Days worked</p>
                  <p className="mt-2 font-display text-3xl text-white">{livePreview.totalDaysWorked}</p>
                </div>
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Total time</p>
                  <p className="mt-2 font-display text-3xl text-white">{formatWorkedMinutesLabel(livePreview.totalMinutesWorked)}</p>
                </div>
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Flags</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{getFlagsLabel(livePreview)}</p>
                </div>
                <div className="px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Summary</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{livePreview.statusSummary}</p>
                </div>
              </div>

              <div className="hidden grid-cols-[1fr_0.9fr_0.8fr_0.8fr_0.6fr] gap-5 border-y border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
                <span>Work date</span>
                <span>Status</span>
                <span>Clock in</span>
                <span>Clock out</span>
                <span>Worked</span>
              </div>

              {livePreview.entries.map((entry) => (
                <div key={entry.workDate.toISOString()} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                  <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr_0.8fr_0.8fr_0.6fr] lg:items-center">
                    <div className="font-semibold text-white">{formatPortalDate(entry.workDate)}</div>
                    <div className="text-sm leading-7 text-slate-300">{entry.attendanceStatus}</div>
                    <div className="text-sm leading-7 text-slate-300">{formatPortalTime(entry.clockInAt)}</div>
                    <div className="text-sm leading-7 text-slate-300">{formatPortalTime(entry.clockOutAt)}</div>
                    <div className="text-sm leading-7 text-white">{formatWorkedMinutesLabel(entry.workedMinutes)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow={isAdmin ? "Saved Timesheets" : "Past Weeks"}
            title={isAdmin ? "Generated weekly records" : "Saved weekly timesheets"}
            description={
              isAdmin
                ? "Filter by week or staff, then open a weekly record to edit or export it."
                : "Each generated week stays available here after the Sunday roll-up runs."
            }
          />

          {isAdmin ? (
            <div className="mt-8 border-y border-white/10 py-6">
              <form className="grid gap-4 md:grid-cols-[0.7fr_0.9fr_auto] md:items-end">
                <label>
                  <span className="auth-label">Week start (Monday)</span>
                  <input type="date" name="week" defaultValue={resolvedSearchParams.week ?? ""} className="auth-input" />
                </label>
                <label>
                  <span className="auth-label">Staff search</span>
                  <input
                    type="search"
                    name="staff"
                    defaultValue={staffSearchValue}
                    placeholder="Name, username, or staff ID"
                    className="auth-input"
                  />
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="button-primary justify-center">
                    Apply Filters
                  </button>
                  <Link href="/portal/timesheets" className="button-secondary">
                    Clear
                  </Link>
                </div>
              </form>
              <p className="mt-4 text-sm text-slate-400">Approved staff in the register: {staffMembers.length}</p>
            </div>
          ) : null}

          <div className="mt-8 border-y border-white/10">
            <div className={`hidden gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid ${isAdmin ? "lg:grid-cols-[0.9fr_0.95fr_0.5fr_0.6fr_0.8fr_0.95fr_0.45fr]" : "lg:grid-cols-[1fr_0.55fr_0.7fr_0.85fr_0.5fr]"}`}>
              <span>Week</span>
              {isAdmin ? <span>Staff member</span> : null}
              <span>Days</span>
              <span>Total time</span>
              <span>Flags</span>
              <span>Status summary</span>
              <span>Open</span>
            </div>

            {timesheets.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                {isAdmin
                  ? "No weekly timesheets match this filter yet. Generate the latest closed week to create the first set."
                  : "No saved weekly timesheets yet. Your first generated week will appear here after the Sunday roll-up or an admin manual run."}
              </div>
            ) : (
              timesheets.map((timesheet) => (
                <div key={timesheet.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                  <div
                    className={`grid gap-5 lg:items-center ${
                      isAdmin
                        ? "lg:grid-cols-[0.9fr_0.95fr_0.5fr_0.6fr_0.8fr_0.95fr_0.45fr]"
                        : "lg:grid-cols-[1fr_0.55fr_0.7fr_0.85fr_0.5fr]"
                    }`}
                  >
                    <div className="font-semibold text-white">
                      {formatWorkWeekLabel({
                        weekStartDate: timesheet.weekStartDate,
                        weekEndDate: timesheet.weekEndDate
                      })}
                    </div>
                    {isAdmin ? (
                      <div className="text-sm leading-7 text-slate-300">
                        <p className="text-white">
                          {timesheet.user.firstName} {timesheet.user.lastName}
                        </p>
                        <p>
                          @{timesheet.user.username}
                          {timesheet.user.staffId ? ` | ${timesheet.user.staffId}` : ""}
                        </p>
                      </div>
                    ) : null}
                    <div className="text-sm leading-7 text-white">{timesheet.totalDaysWorked}</div>
                    <div className="text-sm leading-7 text-white">{formatWorkedMinutesLabel(timesheet.totalMinutesWorked)}</div>
                    <div className="text-sm leading-7 text-slate-300">{getFlagsLabel(timesheet)}</div>
                    <div className="text-sm leading-7 text-slate-300">{timesheet.statusSummary}</div>
                    <div className="lg:text-right">
                      <Link
                        href={buildTimesheetHref({
                          timesheetId: timesheet.id,
                          week: resolvedSearchParams.week,
                          staff: resolvedSearchParams.staff
                        })}
                        className="text-sm font-semibold text-brass transition hover:text-white"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {activeTimesheet ? (
        <section className="section-divider py-8">
          <div className="pt-10">
            <SectionHeading
              eyebrow={isAdmin ? "Weekly Detail" : "Timesheet Detail"}
              title={`${activeTimesheet.user.firstName} ${activeTimesheet.user.lastName}`}
              description={`Week: ${formatWorkWeekLabel({
                weekStartDate: activeTimesheet.weekStartDate,
                weekEndDate: activeTimesheet.weekEndDate
              })}`}
            />

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <Link href={`/portal/timesheets/${activeTimesheet.id}/export`} className="button-secondary">
                Export PDF
              </Link>
              {isAdmin ? (
                <form action={`/portal/timesheets/${activeTimesheet.id}/refresh`} method="post">
                  <input type="hidden" name="timesheetId" value={activeTimesheet.id} />
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={buildTimesheetHref({
                      timesheetId: activeTimesheet.id,
                      week: resolvedSearchParams.week,
                      staff: resolvedSearchParams.staff
                    })}
                  />
                  <button type="submit" className="button-secondary">
                    Refresh From Attendance
                  </button>
                </form>
              ) : null}
              <span className="text-sm text-slate-400">Generated {formatPortalDateTime(activeTimesheet.generatedAt)}</span>
            </div>

            <div className="mt-8 border-y border-white/10">
              <div className="grid gap-0 md:grid-cols-5">
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Days worked</p>
                  <p className="mt-2 font-display text-3xl text-white">{activeTimesheet.totalDaysWorked}</p>
                </div>
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Total time</p>
                  <p className="mt-2 font-display text-3xl text-white">{formatWorkedMinutesLabel(activeTimesheet.totalMinutesWorked)}</p>
                </div>
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Late arrivals</p>
                  <p className="mt-2 font-display text-3xl text-white">{activeTimesheet.lateCount}</p>
                </div>
                <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Early / missed</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {activeTimesheet.earlyClockOutCount} early | {activeTimesheet.missedClockOutCount} missed
                  </p>
                </div>
                <div className="px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-brass">Summary</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{activeTimesheet.statusSummary}</p>
                </div>
              </div>
            </div>

            {isAdmin ? (
              <form action={`/portal/timesheets/${activeTimesheet.id}/update`} method="post" className="mt-8">
                <input type="hidden" name="timesheetId" value={activeTimesheet.id} />
                <input
                  type="hidden"
                  name="redirectTo"
                  value={buildTimesheetHref({
                    timesheetId: activeTimesheet.id,
                    week: resolvedSearchParams.week,
                    staff: resolvedSearchParams.staff
                  })}
                />

                <div className="grid gap-4 border-y border-white/10 py-6">
                  <label>
                    <span className="auth-label">Notes</span>
                    <textarea
                      name="notes"
                      defaultValue={activeTimesheet.notes ?? ""}
                      rows={3}
                      className="auth-input min-h-28 resize-y"
                      placeholder="Add optional notes or corrections for this weekly timesheet."
                    />
                  </label>
                </div>

                <div className="mt-8 border-y border-white/10">
                  <div className="hidden grid-cols-[0.8fr_1fr_1fr_1fr_0.6fr] gap-4 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
                    <span>Work date</span>
                    <span>Status</span>
                    <span>Clock in</span>
                    <span>Clock out</span>
                    <span>Worked minutes</span>
                  </div>

                  {activeTimesheet.entries.map((entry) => (
                    <div key={entry.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                      <input type="hidden" name="entryId" value={entry.id} />
                      <input type="hidden" name="workDate" value={entry.workDate.toISOString()} />
                      <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr_1fr_1fr_0.6fr] lg:items-center">
                        <div className="font-semibold text-white">{formatPortalDate(entry.workDate)}</div>
                        <input
                          type="text"
                          name="attendanceStatus"
                          defaultValue={entry.attendanceStatus}
                          className="auth-input"
                        />
                        <input
                          type="datetime-local"
                          name="clockInAt"
                          defaultValue={formatPortalDateTimeInputValue(entry.clockInAt)}
                          className="auth-input"
                        />
                        <input
                          type="datetime-local"
                          name="clockOutAt"
                          defaultValue={formatPortalDateTimeInputValue(entry.clockOutAt)}
                          className="auth-input"
                        />
                        <input
                          type="number"
                          name="workedMinutes"
                          min="0"
                          defaultValue={String(entry.workedMinutes)}
                          className="auth-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button type="submit" className="button-primary">
                    Save Timesheet Changes
                  </button>
                  <p className="text-sm text-slate-400">
                    Saving updates the weekly totals and keeps the sheet visible to both admin and staff.
                  </p>
                </div>
              </form>
            ) : (
              <div className="mt-8 border-y border-white/10">
                <div className="hidden grid-cols-[1fr_0.9fr_0.8fr_0.8fr_0.6fr] gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
                  <span>Work date</span>
                  <span>Status</span>
                  <span>Clock in</span>
                  <span>Clock out</span>
                  <span>Worked</span>
                </div>

                {activeTimesheet.entries.map((entry) => (
                  <div key={entry.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr_0.8fr_0.8fr_0.6fr] lg:items-center">
                      <div className="font-semibold text-white">{formatPortalDate(entry.workDate)}</div>
                      <div className="text-sm leading-7 text-slate-300">{entry.attendanceStatus}</div>
                      <div className="text-sm leading-7 text-slate-300">{formatPortalTime(entry.clockInAt)}</div>
                      <div className="text-sm leading-7 text-slate-300">{formatPortalTime(entry.clockOutAt)}</div>
                      <div className="text-sm leading-7 text-white">{formatWorkedMinutesLabel(entry.workedMinutes)}</div>
                    </div>
                  </div>
                ))}

                {activeTimesheet.notes ? (
                  <div className="border-t border-white/10 px-4 py-5 text-sm leading-7 text-slate-300">
                    <span className="font-semibold text-white">Notes:</span> {activeTimesheet.notes}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
