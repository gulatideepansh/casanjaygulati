import Image from "next/image";
import Link from "next/link";
import { AccountStatus, UserRole } from "@prisma/client";

import { AdminStaffForm } from "@/components/portal/admin-staff-form";
import { DeactivateStaffControl } from "@/components/portal/deactivate-staff-control";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { deleteStaffAction } from "@/modules/auth/actions";

export const metadata = {
  title: "Staff Management | Casanjaygulati"
};

export default async function StaffManagementPage() {
  await requireAdmin();

  const staffMembers = await getDb().user.findMany({
    where: {
      role: UserRole.STAFF,
      status: AccountStatus.APPROVED
    },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }]
  });

  return (
    <main className="section-shell py-10">
      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow="Staff Management"
            title="Staff management"
            description="Create staff accounts and manage access."
          />

          <div className="mt-8 border-y border-white/10 py-8">
            <div className="max-w-3xl">
              <AdminStaffForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow="Staff Register"
            title="All staff accounts"
            description="Manage active staff records and move former team members into the past staff register."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link href="/portal/past-staff" className="button-secondary">
              View Past Staff
            </Link>
          </div>

          <div className="mt-8 border-y border-white/10">
            <div className="hidden grid-cols-[1.05fr_0.95fr_0.7fr_0.7fr] gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
              <span>Staff member</span>
              <span>Contact</span>
              <span>Login details</span>
              <span>Actions</span>
            </div>

            {staffMembers.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                No staff accounts exist yet.
              </div>
            ) : (
              staffMembers.map((staffUser) => (
                <div key={staffUser.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr_0.7fr_0.7fr] lg:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-base font-semibold text-white">
                        {staffUser.profileImageDataUrl ? (
                          <Image
                            src={staffUser.profileImageDataUrl}
                            alt={`${staffUser.firstName} ${staffUser.lastName}`}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>
                            {staffUser.firstName.slice(0, 1)}
                            {staffUser.lastName.slice(0, 1)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-display text-2xl text-white">
                          {staffUser.firstName} {staffUser.lastName}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">@{staffUser.username}</p>
                      </div>
                    </div>

                    <div className="text-sm leading-7 text-slate-300">
                      <p>{staffUser.email || "No email supplied"}</p>
                    </div>

                    <div className="text-sm leading-7 text-slate-300">
                      <p>Staff ID: <span className="text-white">{staffUser.staffId || "Not assigned"}</span></p>
                      <p>Role: <span className="text-white">{staffUser.role}</span></p>
                    </div>

                    <div className="flex flex-col items-start gap-4 lg:items-end">
                      <DeactivateStaffControl staffUserId={staffUser.id} />
                      <form action={deleteStaffAction.bind(null, staffUser.id)}>
                        <button
                          type="submit"
                          className="text-sm font-semibold text-rose-200 transition hover:text-white"
                        >
                          Delete staff
                        </button>
                      </form>
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
