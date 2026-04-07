import Image from "next/image";
import Link from "next/link";
import { TaskPriority, TaskStatus, UserRole } from "@prisma/client";

import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import {
  EXPECTED_CLOCK_IN_LABEL,
  EXPECTED_CLOCK_OUT_LABEL
} from "@/lib/portal/config";
import {
  formatPortalDate,
  formatPortalDateTime,
  getPortalDateKey
} from "@/lib/portal/time";
import {
  clockInAction,
  clockOutAction,
  updateTaskStatusAction
} from "@/modules/portal/actions";

export const metadata = {
  title: "Portal Dashboard | Casanjaygulati"
};

function getTaskPriorityClass(priority: TaskPriority) {
  switch (priority) {
    case "URGENT":
      return "text-rose-200";
    case "HIGH":
      return "text-amber-200";
    case "MEDIUM":
      return "text-sky-200";
    default:
      return "text-emerald-200";
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
      className="flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-base font-semibold text-white"
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

  const [staffMembers, recentActivity, allTasks, todayAttendance, openTasks, completedTasks] = await Promise.all([
    isAdmin
      ? getDb().user.findMany({
          where: {
            role: UserRole.STAFF
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
          orderBy: {
            createdAt: "desc"
          },
          take: 10,
          include: {
            actorUser: true,
            targetUser: true
          }
        })
      : Promise.resolve([]),
    isAdmin
      ? getDb().task.findMany({
          orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
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
      : Promise.resolve([])
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
      tasksCompleted: allTasks.filter((task) => task.status === "COMPLETED").length
    };

    return (
      <main className="section-shell py-10">
        <section className="section-divider py-8">
          <div className="pt-10">
            <SectionHeading
              eyebrow="Admin Dashboard"
              title="Staff operations in a clean running list."
              description="The front page now stays focused on attendance and task progress. Staff creation and task assignment sit on dedicated pages so the dashboard reads like an operations register rather than a grid of widgets."
            />

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <Link href="/portal/staff" className="button-secondary">
                Manage Staff
              </Link>
              <Link href="/portal/tasks" className="button-secondary">
                Assign Tasks
              </Link>
              <span className="border border-white/10 px-4 py-3">
                Working hours: {EXPECTED_CLOCK_IN_LABEL} to {EXPECTED_CLOCK_OUT_LABEL}
              </span>
            </div>

            <dl className="mt-8 grid gap-0 border-y border-white/10 md:grid-cols-3 xl:grid-cols-6">
              {[
                ["Total staff", summary.totalStaff],
                ["Clocked in now", summary.clockedInNow],
                ["Late today", summary.lateToday],
                ["Open tasks", summary.tasksOpen],
                ["In progress", summary.tasksInProgress],
                ["Completed", summary.tasksCompleted]
              ].map(([label, value]) => (
                <div key={label} className="border-b border-white/10 px-5 py-5 md:border-r md:last:border-r-0 xl:border-b-0">
                  <dt className="text-xs uppercase tracking-[0.28em] text-brass">{label}</dt>
                  <dd className="mt-2 font-display text-3xl text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section-divider py-8">
          <div className="grid gap-12 pt-10 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <SectionHeading
                eyebrow="Attendance"
                title="Today’s staff attendance"
                description="Every staff member appears as a row with start time, end time, and the current attendance state."
              />

              <div className="mt-8 border-y border-white/10">
                <div className="hidden grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.6fr] gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
                  <span>Staff member</span>
                  <span>Contact</span>
                  <span>Attendance</span>
                  <span>Open work</span>
                  <span>Actions</span>
                </div>

                {staffMembers.length === 0 ? (
                  <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                    No staff members exist yet. Create the first profile from the staff page.
                  </div>
                ) : (
                  staffMembers.map((staffUser) => {
                    const todayRecord = staffUser.attendanceRecords[0] ?? null;
                    const openTaskCount = staffUser.assignedTasks.filter((task) => task.status !== "COMPLETED").length;

                    return (
                      <div key={staffUser.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.6fr] lg:items-start">
                          <div className="flex items-start gap-4">
                            <UserAvatar
                              firstName={staffUser.firstName}
                              lastName={staffUser.lastName}
                              profileImageDataUrl={staffUser.profileImageDataUrl}
                            />
                            <div>
                              <p className="font-display text-2xl text-white">
                                {staffUser.firstName} {staffUser.lastName}
                              </p>
                              <p className="mt-1 text-sm text-slate-400">
                                @{staffUser.username}
                                {staffUser.staffId ? ` | ${staffUser.staffId}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="text-sm leading-7 text-slate-300">
                            <p>{staffUser.email || "No email supplied"}</p>
                          </div>

                          <div className="text-sm leading-7 text-slate-300">
                            <p>In: {formatPortalDateTime(todayRecord?.clockInAt ?? null)}</p>
                            <p>Out: {formatPortalDateTime(todayRecord?.clockOutAt ?? null)}</p>
                            <p className="text-white">{todayRecord?.status ? formatStatusLabel(todayRecord.status) : "Not started"}</p>
                          </div>

                          <div className="text-sm leading-7 text-slate-300">
                            <p className="text-white">{openTaskCount} open</p>
                            <p>{staffUser.assignedTasks.filter((task) => task.status === "IN_PROGRESS").length} in progress</p>
                            <p>{staffUser.assignedTasks.filter((task) => task.status === "COMPLETED").length} completed</p>
                          </div>

                          <div className="flex gap-3 lg:justify-end">
                            <Link href={`/portal/tasks?staff=${staffUser.id}`} className="text-sm font-semibold text-brass transition hover:text-white">
                              Assign
                            </Link>
                            <Link href="/portal/staff" className="text-sm font-semibold text-slate-300 transition hover:text-white">
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

            <div>
              <SectionHeading
                eyebrow="Activity"
                title="Recent internal movement"
                description="A direct running log of staff creation, attendance updates, and task actions."
              />

              <div className="mt-8 border-y border-white/10">
                {recentActivity.length === 0 ? (
                  <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                    Activity will appear here as the team uses the portal.
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                      <p className="text-xs uppercase tracking-[0.28em] text-brass">
                        {formatPortalDateTime(activity.createdAt)}
                      </p>
                      <p className="mt-2 font-semibold text-white">{activity.action.replaceAll(".", " ")}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
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
          </div>
        </section>

        <section className="section-divider py-8">
          <div className="pt-10">
            <SectionHeading
              eyebrow="Task Progress"
              title="Every assigned task in one list"
              description="This front page now shows task progress directly so the admin can see pending, in-progress, blocked, and completed work without jumping into staff rows."
            />

            <div className="mt-8 border-y border-white/10">
              <div className="hidden grid-cols-[1.1fr_0.9fr_0.6fr_0.7fr_0.7fr_0.8fr] gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
                <span>Task</span>
                <span>Assigned to</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Due date</span>
                <span>Assigned by</span>
              </div>

              {allTasks.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                  No tasks have been assigned yet. Use the task page to create the first assignment.
                </div>
              ) : (
                allTasks.map((task) => (
                  <div key={task.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr_0.6fr_0.7fr_0.7fr_0.8fr]">
                      <div>
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="mt-1 text-sm leading-7 text-slate-300">{task.description}</p>
                      </div>
                      <div className="text-sm leading-7 text-slate-300">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </div>
                      <div className={`text-sm font-semibold uppercase tracking-[0.22em] ${getTaskPriorityClass(task.priority)}`}>
                        {task.priority}
                      </div>
                      <div className="text-sm leading-7 text-white">{getTaskStatusLabel(task.status)}</div>
                      <div className="text-sm leading-7 text-slate-300">{formatPortalDate(task.dueDate)}</div>
                      <div className="text-sm leading-7 text-slate-300">
                        {task.createdBy.firstName} {task.createdBy.lastName}
                      </div>
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
    <main className="section-shell py-10">
      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow="Staff Dashboard"
            title={`Welcome, ${currentUser.firstName}.`}
            description={`Your working window is ${EXPECTED_CLOCK_IN_LABEL} to ${EXPECTED_CLOCK_OUT_LABEL}. Attendance and task updates are kept in straightforward lists so the page stays practical and easy to scan.`}
          />

          <div className="mt-8 border-y border-white/10">
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr_1fr]">
              <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                <p className="text-xs uppercase tracking-[0.28em] text-brass">Profile</p>
                <div className="mt-4 flex items-start gap-4">
                  <UserAvatar
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    profileImageDataUrl={currentUser.profileImageDataUrl}
                    size={60}
                  />
                  <div className="text-sm leading-7 text-slate-300">
                    <p className="font-semibold text-white">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p>@{currentUser.username}</p>
                    <p>{currentUser.staffId || "No staff ID"}</p>
                    <p>{currentUser.email || "No email configured"}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                <p className="text-xs uppercase tracking-[0.28em] text-brass">Today&apos;s Attendance</p>
                <div className="mt-4 text-sm leading-7 text-slate-300">
                  <p>Clock In: {formatPortalDateTime(todayAttendance?.clockInAt ?? null)}</p>
                  <p>Clock Out: {formatPortalDateTime(todayAttendance?.clockOutAt ?? null)}</p>
                  <p className="text-white">
                    Status: {todayAttendance?.status ? formatStatusLabel(todayAttendance.status) : "Not started"}
                  </p>
                  {todayAttendance ? (
                    <p>
                      Worked: <span className="text-white">{getWorkedDurationLabel(todayAttendance.clockInAt, todayAttendance.clockOutAt)}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-brass">Actions</p>
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
                    <div className="text-sm leading-7 text-slate-300">Attendance for today is complete.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider py-8">
        <div className="grid gap-12 pt-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow="My Open Tasks"
              title="Current assignments"
              description="Open work stays visible here until you mark it complete."
            />

            <div className="mt-8 border-y border-white/10">
              {openTasks.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                  No open tasks assigned right now.
                </div>
              ) : (
                openTasks.map((task) => (
                  <div key={task.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.5fr_0.6fr_0.7fr_auto] lg:items-start">
                      <div>
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{task.description}</p>
                      </div>
                      <div className={`text-sm font-semibold uppercase tracking-[0.22em] ${getTaskPriorityClass(task.priority)}`}>
                        {task.priority}
                      </div>
                      <div className="text-sm leading-7 text-white">{getTaskStatusLabel(task.status)}</div>
                      <div className="text-sm leading-7 text-slate-300">{formatPortalDate(task.dueDate)}</div>
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
              eyebrow="Completed Work"
              title="Recently completed tasks"
              description="Closed work appears here as a short running history."
            />

            <div className="mt-8 border-y border-white/10">
              {completedTasks.length === 0 ? (
                <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                  Completed work will appear here after you start closing tasks.
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      Completed {formatPortalDateTime(task.completedAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
