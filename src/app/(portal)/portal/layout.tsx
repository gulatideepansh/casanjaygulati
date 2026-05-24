import Link from "next/link";
import Image from "next/image";

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
    <div data-portal-shell className="min-h-screen bg-[#f7f5ef] text-ink">
      <header className="border-b border-[#e5dfd3] bg-white">
        <div className="section-shell flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between lg:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="overflow-hidden border border-[#d8d2c4] bg-white">
              <Image
                src="/ca-india-logo.jpg"
                alt="Chartered Accountant India logo"
                width={50}
                height={50}
                className="h-10 w-10 object-cover sm:h-12 sm:w-12"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-ink">Nayyar &amp; Nayyar</p>
              <p className="mt-1 text-sm text-slate-600">Employee portal</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end lg:gap-4">
            <div className="hidden sm:block">
              <LiveClock />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-600 sm:text-sm sm:justify-end">
              <Link href="/" className="transition-colors hover:text-ink">
                Public Website
              </Link>
              {currentUser ? (
                <>
                  <Link href="/portal/dashboard" className="transition-colors hover:text-ink">
                    Dashboard
                  </Link>
                  <Link href="/portal/timesheets" className="transition-colors hover:text-ink">
                    Timesheets
                  </Link>
                  {currentUser.role === "ADMIN" ? (
                    <>
                      <Link href="/portal/staff" className="transition-colors hover:text-ink">
                        Staff
                      </Link>
                      <Link href="/portal/past-staff" className="transition-colors hover:text-ink">
                        Past Staff
                      </Link>
                      <Link href="/portal/tasks" className="transition-colors hover:text-ink">
                        Tasks
                      </Link>
                      <Link href="/portal/activity" className="transition-colors hover:text-ink">
                        Activity
                      </Link>
                    </>
                  ) : null}
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                    >
                      Log Out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/portal/sign-in" className="transition-colors hover:text-ink">
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
