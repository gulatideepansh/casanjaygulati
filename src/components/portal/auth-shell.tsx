import Link from "next/link";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <section className="section-shell grid min-h-[calc(100vh-7rem)] items-center py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <div className="panel-card relative overflow-hidden p-8 lg:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brass/70 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">{eyebrow}</p>
        <h1 className="mt-6 max-w-xl font-display text-4xl leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">{description}</p>

        <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div className="panel-card-soft p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-brass">Secure Access</p>
              <p className="mt-3 leading-7">
                Passwords are stored using Argon2id hashing and all portal sessions use secure
                HTTP-only cookies.
              </p>
            </div>
            <div className="panel-card-soft p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-brass">Admin Managed</p>
              <p className="mt-3 leading-7">
                Staff accounts are created and managed directly inside the admin dashboard.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
            <Link href="/" className="transition hover:text-white">
              Back to website
            </Link>
            <Link href="/portal/sign-in" className="transition hover:text-white">
              Staff sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-card p-6 sm:p-8">
        {children}
        {footer ? <div className="mt-6 border-t border-white/10 pt-6">{footer}</div> : null}
      </div>
    </section>
  );
}
