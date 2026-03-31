import Link from "next/link";
import Image from "next/image";

import { siteContent } from "@/content/site-content";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <Image
              src="/ca-india-logo.jpg"
              alt="CA India logo"
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
              priority
            />
          </div>
          <div>
            <p className="font-display text-[1.35rem] leading-none text-white">{siteContent.firm.name}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.32em] text-slate-400">
              {siteContent.firm.domain}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {siteContent.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition duration-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link href="/#contact" className="button-primary hidden lg:inline-flex lg:px-5 lg:py-2.5">
          Schedule Consultation
        </Link>
      </div>
    </header>
  );
}
