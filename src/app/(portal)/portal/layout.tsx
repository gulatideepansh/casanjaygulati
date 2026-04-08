import Link from "next/link";

import { LiveClock } from "@/components/portal/live-clock";
import { getCurrentUser } from "@/lib/auth/session";
import { signOutAction } from "@/modules/auth/actions";

export default async function PortalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(106,167,172,0.16),transparent_22%),linear-gradient(180deg,#07111b_0%,#0a1624_48%,#050c15_100%)]">
      <header className="border-b border-white/10 bg-black/10 backdrop-blur-xl">
        <div className="section-shell flex flex-col gap-6 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">Employee Portal</p>
            <p className="mt-2 font-display text-2xl text-white">Nayyar &amp; Nayyar</p>
          </div>
          <div className="flex flex-col gap-5 lg:items-end">
            <LiveClock />
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 lg:justify-end">
              <Link href="/" className="transition hover:text-white">
                Public Website
              </Link>
              {currentUser ? (
                <>
                  <Link href="/portal/dashboard" className="transition hover:text-white">
                    Dashboard
                  </Link>
                  <Link href="/portal/timesheets" className="transition hover:text-white">
                    Timesheets
                  </Link>
                  {currentUser.role === "ADMIN" ? (
                    <>
                      <Link href="/portal/staff" className="transition hover:text-white">
                        Staff
                      </Link>
                      <Link href="/portal/past-staff" className="transition hover:text-white">
                        Past Staff
                      </Link>
                      <Link href="/portal/tasks" className="transition hover:text-white">
                        Tasks
                      </Link>
                      <Link href="/portal/activity" className="transition hover:text-white">
                        Activity
                      </Link>
                    </>
                  ) : null}
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="rounded-full border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                    >
                      Log Out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/portal/sign-in" className="transition hover:text-white">
                  Portal Access
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
