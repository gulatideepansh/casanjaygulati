import Link from "next/link";
import Image from "next/image";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <section className="section-shell flex min-h-[calc(100vh-7rem)] items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-md border border-[#d8d2c4] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#e5dfd3] pb-5">
          <div className="overflow-hidden border border-[#d8d2c4] bg-white">
            <Image
              src="/ca-india-logo.jpg"
              alt="Chartered Accountant India logo"
              width={54}
              height={54}
              className="h-12 w-12 object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink">Nayyar &amp; Nayyar</p>
            <p className="mt-1 text-sm text-slate-600">Staff portal</p>
          </div>
        </div>

        <div className="pt-6">
          <h1 className="text-xl font-semibold leading-7 text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="mt-6">{children}</div>

        {footer ? <div className="mt-6 border-t border-[#d8d2c4] pt-6">{footer}</div> : null}

        <div className="mt-6 flex flex-wrap gap-4 border-t border-[#e5dfd3] pt-5 text-sm text-slate-600">
          <Link href="/" className="font-medium text-ink transition-colors hover:text-brass">
            Public website
          </Link>
          <Link href="/portal/sign-in" className="font-medium text-ink transition-colors hover:text-brass">
            Staff sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
