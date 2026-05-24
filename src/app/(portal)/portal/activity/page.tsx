import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { formatPortalDateTime } from "@/lib/portal/time";
import { dismissActivityNotificationAction } from "@/modules/portal/actions";

export const metadata = {
  title: "Activity | Casanjaygulati"
};

function describeActivity(activity: {
  actorUser: { firstName: string; lastName: string } | null;
  targetUser: { firstName: string; lastName: string } | null;
}) {
  const actorLabel = activity.actorUser
    ? `${activity.actorUser.firstName} ${activity.actorUser.lastName}`
    : "System";
  const targetLabel = activity.targetUser
    ? `${activity.targetUser.firstName} ${activity.targetUser.lastName}`
    : "";

  return targetLabel ? `${actorLabel} -> ${targetLabel}` : actorLabel;
}

export default async function ActivityPage() {
  await requireAdmin();

  const [openNotifications, dismissedNotifications] = await Promise.all([
    getDb().auditLog.findMany({
      where: {
        dismissedAt: null
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        actorUser: true,
        targetUser: true
      }
    }),
    getDb().auditLog.findMany({
      where: {
        dismissedAt: {
          not: null
        }
      },
      orderBy: {
        dismissedAt: "desc"
      },
      take: 12,
      include: {
        actorUser: true,
        targetUser: true
      }
    })
  ]);

  return (
    <main className="section-shell py-6">
      <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
        <div>
          <SectionHeading
              variant="portal"
            eyebrow="Activity"
            title="Activity"
            description="Review and dismiss administrative updates."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <Link href="/portal/dashboard" className="button-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e5dfd3] py-6 first:border-t-0">
        <div>
          <SectionHeading
              variant="portal"
            eyebrow="Open"
            title="Unread notifications"
            description="Current activity that still needs admin attention."
          />

          <div className="mt-8 border-y border-[#e5dfd3]">
            {openNotifications.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                No unread notifications right now.
              </div>
            ) : (
              openNotifications.map((activity) => (
                <div key={activity.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                  <div className="grid gap-5 lg:grid-cols-[0.85fr_0.95fr_auto] lg:items-start">
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        {formatPortalDateTime(activity.createdAt)}
                      </p>
                      <p className="mt-2 font-semibold text-ink">{activity.action.replaceAll(".", " ")}</p>
                    </div>
                    <div className="text-sm leading-7 text-slate-700">
                      {describeActivity(activity)}
                    </div>
                    <form action={dismissActivityNotificationAction.bind(null, activity.id)} className="lg:text-right">
                      <button type="submit" className="text-sm font-semibold text-brass transition-colors hover:text-ink">
                        Dismiss
                      </button>
                    </form>
                  </div>
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
            eyebrow="Dismissed"
            title="Recent cleared notifications"
            description="A short history of recently dismissed admin updates."
          />

          <div className="mt-8 border-y border-[#e5dfd3]">
            {dismissedNotifications.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-8 text-slate-700">
                Nothing has been dismissed yet.
              </div>
            ) : (
              dismissedNotifications.map((activity) => (
                <div key={activity.id} className="border-b border-[#e5dfd3] px-4 py-5 last:border-b-0">
                  <div className="grid gap-5 lg:grid-cols-[0.85fr_0.95fr]">
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        Dismissed {formatPortalDateTime(activity.dismissedAt)}
                      </p>
                      <p className="mt-2 font-semibold text-ink">{activity.action.replaceAll(".", " ")}</p>
                    </div>
                    <div className="text-sm leading-7 text-slate-700">
                      {describeActivity(activity)}
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
