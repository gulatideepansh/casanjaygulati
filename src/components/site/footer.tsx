import { siteContent } from "@/content/site-content";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050b15]">
      <div className="section-shell grid gap-8 py-12 text-sm text-slate-400 lg:grid-cols-[1.15fr_0.8fr_0.95fr_1fr]">
        <div className="max-w-xl">
          <p className="font-display text-xl text-white">{siteContent.firm.name}</p>
          <p className="mt-1">{siteContent.firm.tagline}</p>
          <p className="mt-4 leading-7 text-slate-400">{siteContent.firm.address}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quick Links</p>
          <div className="mt-4 space-y-2">
            {siteContent.nav.map((item) => (
              <a key={item.href} href={item.href} className="block transition duration-300 hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Services</p>
          <div className="mt-4 space-y-2">
            {siteContent.footer.services.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>
        <div className="max-w-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Contact</p>
          <div className="mt-4 space-y-2">
            <p>{siteContent.firm.phone}</p>
            <p>{siteContent.firm.email}</p>
            <p>{siteContent.firm.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p>{siteContent.footer.copyright}</p>
          <p>Professional chartered accountancy website designed for future expansion.</p>
        </div>
      </div>
    </footer>
  );
}
