import Image from "next/image";
import Link from "next/link";

import { RestoreStaffControl } from "@/components/portal/restore-staff-control";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { formatPortalDateTime } from "@/lib/portal/time";

export const metadata = {
  title: "Past Staff | Casanjaygulati"
};

function parseYear(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  if (!/^\d{4}$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
}

function getSortOrder(sort: string | undefined) {
  return sort === "oldest" ? "oldest" : "newest";
}

export default async function PastStaffPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    fromYear?: string;
    toYear?: string;
    sort?: string;
  }>;
}) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const searchQuery = resolvedSearchParams.q?.trim() ?? "";
  const fromYear = parseYear(resolvedSearchParams.fromYear);
  const toYear = parseYear(resolvedSearchParams.toYear);
  const sortOrder = getSortOrder(resolvedSearchParams.sort);

  const whereClause = {
    ...(searchQuery
      ? {
          OR: [
            {
              firstName: {
                contains: searchQuery,
                mode: "insensitive" as const
              }
            },
            {
              lastName: {
                contains: searchQuery,
                mode: "insensitive" as const
              }
            },
            {
              username: {
                contains: searchQuery,
                mode: "insensitive" as const
              }
            },
            {
              email: {
                contains: searchQuery,
                mode: "insensitive" as const
              }
            }
          ]
        }
      : {}),
    ...(fromYear || toYear
      ? {
          deactivatedAt: {
            ...(fromYear ? { gte: new Date(Date.UTC(fromYear, 0, 1)) } : {}),
            ...(toYear ? { lte: new Date(Date.UTC(toYear, 11, 31, 23, 59, 59, 999)) } : {})
          }
        }
      : {})
  };

  const pastStaff = await getDb().deactivatedStaff.findMany({
    where: whereClause,
    orderBy: [
      {
        deactivatedAt: sortOrder === "oldest" ? "asc" : "desc"
      },
      {
        firstName: "asc"
      },
      {
        lastName: "asc"
      }
    ]
  });

  const linkedUserIds = pastStaff
    .map((staffUser) => staffUser.originalUserId)
    .filter((value): value is string => Boolean(value));

  const existingUsers = linkedUserIds.length
    ? await getDb().user.findMany({
        where: {
          id: {
            in: linkedUserIds
          }
        },
        select: {
          id: true
        }
      })
    : [];

  const existingUserIdSet = new Set(existingUsers.map((user) => user.id));

  return (
    <main className="section-shell py-10">
      <section className="section-divider py-8">
        <div className="pt-10">
          <SectionHeading
            eyebrow="Past Staff"
            title="Past staff register"
            description="Search archived staff records and filter them by year or archive order."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link href="/portal/staff" className="button-secondary">
              Back to Staff
            </Link>
          </div>

          <form className="mt-8 border-y border-white/10 py-6">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr_auto_auto] lg:items-end">
              <div>
                <label htmlFor="q" className="auth-label">
                  Search by name or email
                </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={searchQuery}
                  className="auth-input"
                  placeholder="Enter staff name or email"
                />
              </div>

              <div>
                <label htmlFor="fromYear" className="auth-label">
                  From year
                </label>
                <input
                  id="fromYear"
                  name="fromYear"
                  defaultValue={resolvedSearchParams.fromYear ?? ""}
                  className="auth-input"
                  inputMode="numeric"
                  placeholder="2023"
                />
              </div>

              <div>
                <label htmlFor="toYear" className="auth-label">
                  To year
                </label>
                <input
                  id="toYear"
                  name="toYear"
                  defaultValue={resolvedSearchParams.toYear ?? ""}
                  className="auth-input"
                  inputMode="numeric"
                  placeholder="2026"
                />
              </div>

              <div>
                <label htmlFor="sort" className="auth-label">
                  Sort by archive date
                </label>
                <select id="sort" name="sort" defaultValue={sortOrder} className="auth-input">
                  <option value="newest">Newest to oldest</option>
                  <option value="oldest">Oldest to newest</option>
                </select>
              </div>

              <button type="submit" className="button-primary justify-center">
                Apply
              </button>

              <Link href="/portal/past-staff" className="button-secondary text-center">
                Reset
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="section-divider py-8">
        <div className="pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeading
              eyebrow="Archived Records"
              title="Past staff members"
              description={`${pastStaff.length} archived staff record${pastStaff.length === 1 ? "" : "s"} found.`}
            />
          </div>

          <div className="mt-8 border-y border-white/10">
            <div className="hidden grid-cols-[1.05fr_0.95fr_0.7fr_0.7fr_0.7fr] gap-5 border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.26em] text-brass lg:grid">
              <span>Staff member</span>
              <span>Contact</span>
              <span>Tenure</span>
              <span>Archived</span>
              <span>Actions</span>
            </div>

            {pastStaff.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-8 text-slate-300">
                No past staff records match the current search or filters.
              </div>
            ) : (
              pastStaff.map((staffUser) => (
                <div key={staffUser.id} className="border-b border-white/10 px-4 py-5 last:border-b-0">
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr_0.7fr_0.7fr_0.7fr] lg:items-start">
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
                      <p>
                        Tenure: <span className="text-white">{staffUser.tenureLabel}</span>
                      </p>
                      <p>
                        Role: <span className="text-white">{staffUser.role}</span>
                      </p>
                    </div>

                    <div className="text-sm leading-7 text-slate-300">
                      <p>
                        Archived <span className="text-white">{formatPortalDateTime(staffUser.deactivatedAt)}</span>
                      </p>
                      <p>
                        Joined <span className="text-white">{formatPortalDateTime(staffUser.joinedAt)}</span>
                      </p>
                    </div>

                    <RestoreStaffControl
                      archiveId={staffUser.id}
                      requiresPassword={!staffUser.originalUserId || !existingUserIdSet.has(staffUser.originalUserId)}
                    />
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
