import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";

import { siteContent } from "@/content/site-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
      <div className="absolute left-10 top-28 h-40 w-40 rounded-full bg-brass/10 blur-3xl" />
      <div className="absolute right-12 top-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

      <div className="section-shell relative py-20 lg:py-28">
        <div className="mx-auto max-w-5xl animate-fade-up text-center">
          <h1 className="font-display text-5xl leading-[0.98] text-white sm:text-6xl lg:text-[4.75rem]">
            Welcome to Nayyar & Nayyar
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-[17px] leading-8 text-slate-300 sm:text-lg">
            {siteContent.firm.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brass" />
              More than 3 decades of experience
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brass/80" />
              25+ person professional team
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {siteContent.heroPillars.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-11 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/#contact" className="button-primary text-center">
              Request a Consultation
            </Link>
            <Link href="/services" className="button-secondary text-center">
              Explore Services
            </Link>
          </div>
        </div>

        <div className="animate-fade-up-delayed mt-14 overflow-hidden rounded-[2rem] border border-white/10">
          <div className="relative">
            <Image
              src="/hero-desk-stock.jpg"
              alt="Desk setup with calculator, pen, and paperwork for NAYYAR & NAYYAR"
              width={1600}
              height={900}
              className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[380px]"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.08),rgba(8,17,31,0.68))]" />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(7,17,29,0.96))] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-brass">Professional Practice</p>
                  <p className="mt-4 text-base leading-8 text-slate-200">
                    The firm combines long-standing experience with practical, partner-led advice across
                    audit, taxation, compliance, and business matters.
                  </p>
                </div>
                <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
                  <div className="border-l border-white/15 pl-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-1 text-brass" />
                      <div>
                        <p className="font-semibold text-white">Located in South Delhi</p>
                        <p className="mt-1 leading-6 text-slate-300">
                          Serving clients through an established and accessible office base.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-white/15 pl-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={18} className="mt-1 text-brass" />
                      <div>
                        <p className="font-semibold text-white">Direct professional oversight</p>
                        <p className="mt-1 leading-6 text-slate-300">
                          A focused team structure keeps communication careful and accountable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-0 border-t border-white/10 bg-[#08111d]/95 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-b border-white/10 px-6 py-5 sm:border-r sm:last:border-r-0 lg:border-b-0"
              >
                <p className="font-display text-3xl text-white">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
