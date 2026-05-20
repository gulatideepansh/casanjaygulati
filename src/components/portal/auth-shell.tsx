import Link from "next/link";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <section className="section-shell grid min-h-[calc(100vh-7rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_0.92fr] lg:py-14">
      <div className="order-2 relative overflow-hidden bg-[linear-gradient(145deg,#08243d,#003b5c)] p-8 text-white shadow-[0_24px_70px_rgba(8,36,61,0.18)] lg:order-1 lg:min-h-[34rem] lg:p-12">
        <div className="flex items-center gap-3">
          <div className="overflow-hidden bg-white">
            <Image
              src="/ca-india-logo.jpg"
              alt="Chartered Accountant India logo"
              width={54}
              height={54}
              className="h-14 w-14 object-cover"
              priority
            />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold leading-none text-white">NAYYAR &amp; NAYYAR</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
              Chartered Accountants
            </p>
          </div>
        </div>

        <div className="mt-14 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brass">{eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-8 text-white/78">{description}</p>
        </div>

        <div className="mt-10 h-px w-24 bg-brass" />

        <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/70">
          <Link href="/" className="transition hover:text-white">
            Back to website
          </Link>
          <Link href="/portal/sign-in" className="transition hover:text-white">
            Staff sign in
          </Link>
        </div>
      </div>

      <div className="order-1 border border-[#d8d2c4] bg-white p-6 shadow-[0_24px_70px_rgba(8,36,61,0.12)] sm:p-8 lg:order-2">
        <div className="mb-7 flex h-12 w-12 items-center justify-center bg-ink text-white">
          <LockKeyhole size={22} />
        </div>
        {children}
        {footer ? <div className="mt-6 border-t border-[#d8d2c4] pt-6">{footer}</div> : null}
      </div>
    </section>
  );
}
