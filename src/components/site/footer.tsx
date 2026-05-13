import Image from "next/image";

import { siteContent } from "@/content/site-content";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="section-shell grid gap-8 py-12 text-sm text-white/75 lg:grid-cols-[1.15fr_0.8fr_0.95fr_1fr]">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden bg-white">
              <Image
                src="/ca-india-logo.jpg"
                alt="Chartered Accountant India logo"
                width={44}
                height={44}
                className="h-11 w-11 object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl leading-none text-white">{siteContent.firm.name}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                Chartered Accountants
              </p>
            </div>
          </div>
          <p className="mt-1">{siteContent.firm.tagline}</p>
          <p className="mt-4 leading-7 text-slate-400">{siteContent.firm.address}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">Quick Links</p>
          <div className="mt-4 space-y-2">
            {siteContent.nav.map((item) => (
              <a key={item.href} href={item.href} className="block transition duration-300 hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">Services</p>
          <div className="mt-4 space-y-2">
            {siteContent.footer.services.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>
        <div className="max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">Contact</p>
          <div className="mt-4 space-y-2">
            <p>{siteContent.firm.phone}</p>
            <p>{siteContent.firm.email}</p>
            <p>{siteContent.firm.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="section-shell flex flex-col gap-2 py-5 text-sm text-white/55 lg:flex-row lg:items-center lg:justify-between">
          <p>{siteContent.footer.copyright}</p>
          <p>Serving clients with dependable chartered accountancy and compliance support.</p>
        </div>
      </div>
    </footer>
  );
}
