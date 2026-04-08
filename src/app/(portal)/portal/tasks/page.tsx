import Link from "next/link";
import { AccountStatus, UserRole } from "@prisma/client";

import { AdminTaskForm } from "@/components/portal/admin-task-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { formatPortalDate, formatPortalDateTime, getPortalDueState } from "@/lib/portal/time";
import { deleteTaskAction } from "@/modules/portal/actions";

export const metadata = {
  title: "Task Management | Casanjaygulati"
};

function getTaskPriorityClass(priority: string) {
  switch (priority) {
    case "URGENT":
      return "text-rose-300";
    case "HIGH":
      return "text-rose-200";
    case "MEDIUM":
      return "text-amber-200";
    default:
      return "text-emerald-200";
  }
}

function getTaskDueTone(dueDate: Date) {
  switch (getPortalDueState(dueDate)) {
    case "OVERDUE":
      return "text-rose-300";
    case "TODAY":
      return "text-amber-200";
    default:
      return "text-emerald-300";
  }
}

export default async function TaskManagementPage({
  searchParams
}: {
  searchParams: Promise<{ staff?: string }>;
}) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const [staffMembers, tasks] = await Promise.all([
    getDb().user.findMany({
      where: {
        role: UserRole.STAFF,
        status: AccountStatus.APPROVED
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        staffId: true
      }
    }),
    getDb().task.findMany({
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
  ]);

  const staffOptions = staffMembers.map((staffUser) => ({
    id: staffUser.id,
    fullName: `${staffUser.firstName} ${staffUser.lastName}`,
    staffId: staffUser.staffId
  }));

  return (
    <main className="section-shell py-10">
      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow="Task Management"
            title="Task management"
            description="Assign work and review current workload."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link href="/portal/dashboard" className="button-secondary">
              Back to Dashboard
            </Link>
            <Link href="/portal/staff" className="button-secondary">
              Staff Page
            </Link>
          </div>

          <div className="mt-8 border-y border-white/10 py-8">
            {staffOptions.length === 0 ? (
              <p className="text-sm leading-8 text-slate-300">
                No staff members exist yet. Create staff profiles first before assigning work.
              </p>
            ) : (
              <div className="max-w-3xl">
                <AdminTaskForm
                  staffOptions={staffOptions}
                  initialStaffUserId={resolvedSearchParams.staff}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow="Task Register"
            title="All assigned tasks"
            description="This list shows the full progress trail across the team so the dashboard can stay focused on summary progress."
          />

          <div className="mt-8 border-y border-white/10">
            <div className="hidden grid-cols-[1.05fr_0.8fr_0.55fr_0.65fr_0.7fr_0.8fr_0.55fr] gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
              <span>Task</span>
              <span>Assigned to</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Due</span>
              <span>Meta</span>
              <span>Actions</span>
            </div>

            {tasks.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                No tasks have been assigned yet.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.8fr_0.55fr_0.65fr_0.7fr_0.8fr_0.55fr] lg:items-start">
                    <div>
                      <p className={`font-semibold ${getTaskDueTone(task.dueDate)}`}>{task.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{task.description}</p>
                    </div>
                    <div className="text-sm leading-7 text-slate-300">
                      {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </div>
                    <div className={`text-sm font-semibold uppercase tracking-[0.22em] ${getTaskPriorityClass(task.priority)}`}>
                      {task.priority}
                    </div>
                    <div className="text-sm leading-7 text-white">
                      {task.status.replaceAll("_", " ")}
                    </div>
                    <div className={`text-sm leading-7 ${getTaskDueTone(task.dueDate)}`}>{formatPortalDate(task.dueDate)}</div>
                    <div className="text-sm leading-7 text-slate-300">
                      <p>By {task.createdBy.firstName} {task.createdBy.lastName}</p>
                      <p>Created {formatPortalDateTime(task.createdAt)}</p>
                    </div>
                    <form action={deleteTaskAction} className="lg:text-right">
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        type="submit"
                        className="text-sm font-semibold text-rose-200 transition hover:text-white"
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
