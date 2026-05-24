import Image from "next/image";
import Link from "next/link";
import { AccountStatus, TaskPriority, TaskStatus, UserRole } from "@prisma/client";

import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import {
  EXPECTED_CLOCK_IN_HOUR,
  EXPECTED_CLOCK_IN_MINUTE,
  EXPECTED_CLOCK_IN_LABEL,
  EXPECTED_CLOCK_OUT_LABEL
} from "@/lib/portal/config";
import {
  formatPortalDate,
  formatPortalDateTime,
  getPortalDateKey,
  getPortalDueState,
  getPortalMinutes
} from "@/lib/portal/time";
import { formatWorkWeekLabel, formatWorkedMinutesLabel } from "@/lib/portal/timesheets";
import {
  clockInAction,
  clockOutAction,
  deleteTaskAction,
  updateTaskStatusAction
} from "@/modules/portal/actions";

export const metadata = {
  title: "Portal Dashboard | Casanjaygulati"
};

function getTaskPriorityClass(priority: TaskPriority) {
  switch (priority) {
    case "URGENT":
      return "text-rose-700";
    case "HIGH":
      return "text-rose-700";
    case "MEDIUM":
      return "text-amber-700";
    default:
      return "text-emerald-700";
  }
}

function getTaskStatusLabel(status: TaskStatus) {
  return status.replaceAll("_", " ");
}

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getWorkedDurationLabel(clockInAt: Date, clockOutAt: Date | null) {
  const endTime = clockOutAt ?? new Date();
  const totalMinutes = Math.max(0, Math.round((endTime.getTime() - clockInAt.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getAttendanceIndicator(attendanceRecord: { clockInAt: Date } | null) {
  const expectedClockInMinutes = EXPECTED_CLOCK_IN_HOUR * 60 + EXPECTED_CLOCK_IN_MINUTE;

  if (!attendanceRecord) {
    if (getPortalMinutes() >= expectedClockInMinutes) {
      return {
        label: "Due",
        dotClass: "bg-amber-300"
      };
    }

    return {
      label: "Pending",
      dotClass: "bg-slate-500"
    };
  }

  return getPortalMinutes(attendanceRecord.clockInAt) > expectedClockInMinutes
    ? {
        label: "Late",
        dotClass: "bg-rose-400"
      }
    : {
        label: "On time",
        dotClass: "bg-emerald-400"
      };
}

function getTaskDueTone(dueDate: Date) {
  switch (getPortalDueState(dueDate)) {
    case "OVERDUE":
      return "text-rose-700";
    case "TODAY":
      return "text-amber-700";
    default:
      return "text-emerald-700";
  }
}

function UserAvatar({
  firstName,
  lastName,
  profileImageDataUrl,
  size = 52
}: {
  firstName: string;
  lastName: string;
  profileImageDataUrl: string | null;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full border border-[#e5dfd3] bg-[#f4f1ea] text-base font-semibold text-ink"
      style={{ width: size, height: size }}
    >
      {profileImageDataUrl ? (
        <Image
          src={profileImageDataUrl}
          alt={`${firstName} ${lastName}`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <span>
          {firstName.slice(0, 1)}
          {lastName.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const todayKey = getPortalDateKey();

  const [staffMembers, activityNotifications, activityNotificationCount, allTasks, todayAttendance, openTasks, completedTasks, latestWeeklyTimesheet] = await Promise.all([
    isAdmin
      ? getDb().user.findMany({
          where: {
            role: UserRole.STAFF,
            status: AccountStatus.APPROVED
          },
          orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
          include: {
            attendanceRecords: {
              where: {
                workDateKey: todayKey
              },
              orderBy: {
                createdAt: "desc"
              },
              take: 1
            },
            assignedTasks: {
              orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }]
            }
          }
        })
      : Promise.resolve([]),
    isAdmin
      ? getDb().auditLog.findMany({
          where: {
            dismissedAt: null
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 3,
          include: {
            actorUser: true,
            targetUser: true
          }
        })
      : Promise.resolve([]),
    isAdmin
      ? getDb().auditLog.count({
          where: {
            dismissedAt: null
          }
        })
      : Promise.resolve(0),
    isAdmin
      ? getDb().task.findMany({
          where: {
            assignedTo: {
              status: AccountStatus.APPROVED
            }
          },
          orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
          include: {
            assignedTo: true,
            createdBy: true
          }
        })
      : Promise.resolve([]),
    !isAdmin
      ? getDb().attendance.findUnique({
          where: {
            userId_workDateKey: {
              userId: currentUser.id,
              workDateKey: todayKey
            }
          }
        })
      : Promise.resolve(null),
    !isAdmin
      ? getDb().task.findMany({
          where: {
            assignedToUserId: currentUser.id,
            status: {
              not: "COMPLETED"
            }
          },
          orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }]
        })
      : Promise.resolve([]),
    !isAdmin
      ? getDb().task.findMany({
          where: {
            assignedToUserId: currentUser.id,
            status: "COMPLETED"
          },
          orderBy: {
            completedAt: "desc"
          },
          take: 6
        })
      : Promise.resolve([]),
    !isAdmin
      ? getDb().weeklyTimesheet.findFirst({
          where: {
            userId: currentUser.id
          },
          orderBy: {
            weekStartDate: "desc"
          }
        })
      : Promise.resolve(null)
  ]);

  if (isAdmin) {
    const summary = {
      totalStaff: staffMembers.length,
      clockedInNow: staffMembers.filter(
        (staffUser) => staffUser.attendanceRecords[0] && !staffUser.attendanceRecords[0].clockOutAt
      ).length,
      lateToday: staffMembers.filter((staffUser) => staffUser.attendanceRecords[0]?.status === "LATE").length,
      tasksOpen: allTasks.filter((task) => task.status !== "COMPLETED").length,
      tasksInProgress: allTasks.filter((task) => task.status === "IN_PROGRESS").length,
      tasksCompleted: allTasks.filter((task) => task.status === "COMPLETED").length,
      notificationsOpen: activityNotificationCount
    };

    return (
      <main className="section-shell py-6">
        <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
          <div>
            <SectionHeading
              variant="portal"
              eyebrow="Admin Dashboard"
              title="Staff operations"
              description="Review attendance, monitor task progress, and manage daily staff activity."
            />

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <Link href="/portal/staff" className="button-secondary">
                Manage Staff
              </Link>
              <Link href="/portal/tasks" className="button-secondary">
                Assign Tasks
              </Link>
              <Link href="/portal/activity" className="button-secondary">
                Activity
              </Link>
              <Link href="/portal/timesheets" className="button-secondary">
                Timesheets
              </Link>
              <span className="border border-[#e5dfd3] px-4 py-3">
                Working hours: {EXPECTED_CLOCK_IN_LABEL} to {EXPECTED_CLOCK_OUT_LABEL}
              </span>
            </div>

            <dl className="mt-8 grid gap-0 border-y border-[#e5dfd3] md:grid-cols-3 xl:grid-cols-6">
              {[
                ["Total staff", summary.totalStaff],
                ["Clocked in now", summary.clockedInNow],
                ["Late today", summary.lateToday],
                ["Open tasks", summary.tasksOpen],
                ["In progress", summary.tasksInProgress],
                ["Completed", summary.tasksCompleted]
              ].map(([label, value]) => (
                <div key={label} className="border-b border-[#e5dfd3] px-5 py-5 md:border-r md:last:border-r-0 xl:border-b-0">
                  <dt className="text-sm font-semibold text-slate-600">{label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
          <div>
            <SectionHeading
              variant="portal"
              eyebrow="Attendance"
              title="Staff attendance"
              description="Today's attendance at a glance."
            />

            <div className="mt-8 border-y border-[#e5dfd3]">
              <div className="hidden grid-cols-[1.15fr_1fr_1.2fr_0.9fr_0.55fr] gap-6 border-b border-[#e5dfd3] px-4 py-4 text-sm font-semibold text-slate-600 lg:grid">
                <span>Staff member</span>
                <span>Contact</span>
                <span>Attendance</span>
                <span>Work</span>
                <span>Actions</span>
              </div>

              {staffMembers.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                  No staff members exist yet. Create the first profile from the staff page.
                </div>
              ) : (
                staffMembers.map((staffUser) => {
                  const todayRecord = staffUser.attendanceRecords[0] ?? null;
                  const openTaskCount = staffUser.assignedTasks.filter((task) => task.status !== "COMPLETED").length;
                  const activeTaskCount = staffUser.assignedTasks.filter((task) => task.status === "IN_PROGRESS").length;
                  const completedTaskCount = staffUser.assignedTasks.filter((task) => task.status === "COMPLETED").length;
                  const attendanceIndicator = getAttendanceIndicator(todayRecord);

                  return (
                    <div key={staffUser.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr_1.2fr_0.9fr_0.55fr] lg:items-center">
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            firstName={staffUser.firstName}
                            lastName={staffUser.lastName}
                            profileImageDataUrl={staffUser.profileImageDataUrl}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex h-2.5 w-2.5 rounded-full ${attendanceIndicator.dotClass}`} />
                              <p className="text-lg font-semibold text-ink">
                                {staffUser.firstName} {staffUser.lastName}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              @{staffUser.username}
                              {staffUser.staffId ? ` | ${staffUser.staffId}` : ""}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              {attendanceIndicator.label}
                            </p>
                          </div>
                        </div>

                        <div className="min-w-0 text-sm text-slate-700">
                          <p className="truncate">{staffUser.email || "No email supplied"}</p>
                        </div>

                        <div className="text-sm text-slate-700">
                          <p>
                            In {formatPortalDateTime(todayRecord?.clockInAt ?? null)} | Out{" "}
                            {formatPortalDateTime(todayRecord?.clockOutAt ?? null)}
                          </p>
                          <p className="mt-1 text-ink">
                            {todayRecord?.status ? formatStatusLabel(todayRecord.status) : "Not started"}
                          </p>
                        </div>

                        <div className="text-sm text-slate-700">
                          <p>
                            <span className="text-ink">{openTaskCount} open</span> | {activeTaskCount} active | {completedTaskCount} done
                          </p>
                        </div>

                        <div className="flex gap-4 lg:justify-end">
                          <Link href={`/portal/tasks?staff=${staffUser.id}`} className="whitespace-nowrap text-sm font-semibold text-brass transition-colors hover:text-ink">
                            Assign
                          </Link>
                          <Link href="/portal/staff" className="whitespace-nowrap text-sm font-semibold text-slate-700 transition-colors hover:text-ink">
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
          <div>
            <SectionHeading
              variant="portal"
              eyebrow="Notifications"
              title="Notifications"
              description="Unread administrative updates."
            />

            <div className="mt-8 border-y border-[#e5dfd3]">
              <div className="grid gap-6 border-b border-[#e5dfd3] px-4 py-5 md:grid-cols-[0.5fr_1fr] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-600">Open notifications</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{summary.notificationsOpen}</p>
                </div>
                <div className="text-sm text-slate-700 md:text-right">
                  <Link href="/portal/activity" className="inline-flex font-semibold text-brass transition-colors hover:text-ink">
                    View all activity
                  </Link>
                </div>
              </div>
              {activityNotifications.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                  No open notifications.
                </div>
              ) : (
                activityNotifications.map((activity) => (
                  <div key={activity.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                    <p className="text-sm font-semibold text-slate-600">
                      {formatPortalDateTime(activity.createdAt)}
                    </p>
                    <p className="mt-2 font-semibold text-ink">{activity.action.replaceAll(".", " ")}</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {activity.actorUser
                        ? `${activity.actorUser.firstName} ${activity.actorUser.lastName}`
                        : "System"}
                      {activity.targetUser ? ` -> ${activity.targetUser.firstName} ${activity.targetUser.lastName}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
          <div>
            <SectionHeading
              variant="portal"
              eyebrow="Task Progress"
              title="Task progress"
              description="Current task status across the team."
            />

            <div className="mt-8 border-y border-[#e5dfd3]">
              <div className="hidden grid-cols-[1.1fr_0.9fr_0.6fr_0.7fr_0.7fr_0.8fr_0.55fr] gap-5 border-b border-[#e5dfd3] px-4 py-4 text-sm font-semibold text-slate-600 lg:grid">
                <span>Task</span>
                <span>Assigned to</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Due date</span>
                <span>Assigned by</span>
                <span>Actions</span>
              </div>

              {allTasks.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                  No tasks have been assigned yet. Use the task page to create the first assignment.
                </div>
              ) : (
                allTasks.map((task) => (
                  <div key={task.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr_0.6fr_0.7fr_0.7fr_0.8fr_0.55fr] lg:items-start">
                      <div>
                        <p className={`font-semibold ${getTaskDueTone(task.dueDate)}`}>{task.title}</p>
                        <p className="mt-1 text-sm leading-7 text-slate-700">{task.description}</p>
                      </div>
                      <div className="text-sm leading-7 text-slate-700">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </div>
                      <div className={`text-sm font-semibold ${getTaskPriorityClass(task.priority)}`}>
                        {task.priority}
                      </div>
                      <div className="text-sm leading-7 text-ink">{getTaskStatusLabel(task.status)}</div>
                      <div className={`text-sm leading-7 ${getTaskDueTone(task.dueDate)}`}>{formatPortalDate(task.dueDate)}</div>
                      <div className="text-sm leading-7 text-slate-700">
                        {task.createdBy.firstName} {task.createdBy.lastName}
                      </div>
                      <form action={deleteTaskAction} className="lg:text-right">
                        <input type="hidden" name="taskId" value={task.id} />
                        <button
                          type="submit"
                          className="text-sm font-semibold text-rose-700 transition-colors hover:text-ink"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="section-shell py-6">
      <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
        <div>
          <SectionHeading
              variant="portal"
            eyebrow="Staff Dashboard"
            title={`Welcome, ${currentUser.firstName}.`}
            description={`Your working window is ${EXPECTED_CLOCK_IN_LABEL} to ${EXPECTED_CLOCK_OUT_LABEL}. Attendance and task updates are kept in straightforward lists so the page stays practical and easy to scan.`}
          />

          <div className="mt-8 border-y border-[#e5dfd3]">
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr_1fr]">
              <div className="border-b border-[#e5dfd3] px-5 py-5 md:border-b-0 md:border-r">
                <p className="text-sm font-semibold text-slate-600">Profile</p>
                <div className="mt-4 flex items-start gap-4">
                  <UserAvatar
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    profileImageDataUrl={currentUser.profileImageDataUrl}
                    size={60}
                  />
                  <div className="text-sm leading-7 text-slate-700">
                    <p className="font-semibold text-ink">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p>@{currentUser.username}</p>
                    <p>{currentUser.staffId || "No staff ID"}</p>
                    <p>{currentUser.email || "No email configured"}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#e5dfd3] px-5 py-5 md:border-b-0 md:border-r">
                <p className="text-sm font-semibold text-slate-600">Today&apos;s Attendance</p>
                <div className="mt-4 text-sm leading-7 text-slate-700">
                  <p>Clock In: {formatPortalDateTime(todayAttendance?.clockInAt ?? null)}</p>
                  <p>Clock Out: {formatPortalDateTime(todayAttendance?.clockOutAt ?? null)}</p>
                  <p className="text-ink">
                    Status: {todayAttendance?.status ? formatStatusLabel(todayAttendance.status) : "Not started"}
                  </p>
                  {todayAttendance ? (
                    <p>
                      Worked: <span className="text-ink">{getWorkedDurationLabel(todayAttendance.clockInAt, todayAttendance.clockOutAt)}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-sm font-semibold text-slate-600">Actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  {!todayAttendance ? (
                    <form action={clockInAction}>
                      <button type="submit" className="button-primary">
                        Clock In
                      </button>
                    </form>
                  ) : !todayAttendance.clockOutAt ? (
                    <form action={clockOutAction}>
                      <button type="submit" className="button-primary">
                        Clock Out
                      </button>
                    </form>
                  ) : (
                    <div className="text-sm leading-7 text-slate-700">Attendance for today is complete.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              variant="portal"
              eyebrow="My Open Tasks"
              title="Current assignments"
              description="Open work stays visible here until you mark it complete."
            />

            <div className="mt-8 border-y border-[#e5dfd3]">
              {openTasks.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                  No open tasks assigned right now.
                </div>
              ) : (
                openTasks.map((task) => (
                  <div key={task.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.5fr_0.6fr_0.7fr_auto] lg:items-start">
                      <div>
                        <p className={`font-semibold ${getTaskDueTone(task.dueDate)}`}>{task.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{task.description}</p>
                      </div>
                      <div className={`text-sm font-semibold ${getTaskPriorityClass(task.priority)}`}>
                        {task.priority}
                      </div>
                      <div className="text-sm leading-7 text-ink">{getTaskStatusLabel(task.status)}</div>
                      <div className={`text-sm leading-7 ${getTaskDueTone(task.dueDate)}`}>{formatPortalDate(task.dueDate)}</div>
                      <form action={updateTaskStatusAction} className="flex gap-3 lg:justify-end">
                        <input type="hidden" name="taskId" value={task.id} />
                        <select name="status" defaultValue={task.status} className="auth-input min-w-44">
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button type="submit" className="button-primary justify-center">
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <SectionHeading
              variant="portal"
              eyebrow="Completed Work"
              title="Recently completed tasks"
              description="Closed work appears here as a short running history."
            />

            <div className="mt-8 border-y border-[#e5dfd3]">
              {completedTasks.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                  Completed work will appear here after you start closing tasks.
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                    <p className="font-semibold text-ink">{task.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Completed {formatPortalDateTime(task.completedAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
        <div>
          <SectionHeading
              variant="portal"
            eyebrow="Latest Timesheet"
            title="Latest generated week"
            description="The newest saved weekly roll-up stays visible here, with the full archive available on the timesheets page."
          />

          <div className="mt-8 border-y border-[#e5dfd3]">
            {!latestWeeklyTimesheet ? (
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm leading-8 text-slate-700">
                <p>Your first weekly timesheet will appear here after the Sunday generation run.</p>
                <Link href="/portal/timesheets" className="text-sm font-semibold text-brass transition-colors hover:text-ink">
                  Open timesheets
                </Link>
              </div>
            ) : (
              <div className="grid gap-0 md:grid-cols-[1.2fr_0.7fr_0.7fr_1fr_auto] md:items-center">
                <div className="border-b border-[#e5dfd3] px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-slate-600">Week</p>
                  <p className="mt-2 text-lg font-semibold text-ink">
                    {formatWorkWeekLabel({
                      weekStartDate: latestWeeklyTimesheet.weekStartDate,
                      weekEndDate: latestWeeklyTimesheet.weekEndDate
                    })}
                  </p>
                </div>
                <div className="border-b border-[#e5dfd3] px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-slate-600">Days worked</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{latestWeeklyTimesheet.totalDaysWorked}</p>
                </div>
                <div className="border-b border-[#e5dfd3] px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-slate-600">Total time</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">
                    {formatWorkedMinutesLabel(latestWeeklyTimesheet.totalMinutesWorked)}
                  </p>
                </div>
                <div className="border-b border-[#e5dfd3] px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold text-slate-600">Summary</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{latestWeeklyTimesheet.statusSummary}</p>
                </div>
                <div className="px-5 py-5 md:text-right">
                  <Link
                    href={`/portal/timesheets?timesheet=${latestWeeklyTimesheet.id}`}
                    className="text-sm font-semibold text-brass transition-colors hover:text-ink"
                  >
                    Open detail
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
