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

      <div className="section-shell relative grid gap-14 py-20 lg:grid-cols-[0.98fr_1.02fr] lg:py-28">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-200">
            Established Chartered Accountants in New Delhi
          </div>
          <h1 className="mt-8 max-w-4xl font-display text-5xl leading-[0.98] text-white sm:text-6xl lg:text-[4.5rem]">
            Trusted financial guidance for businesses and families who value steady counsel.
          </h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-8 text-slate-300 sm:text-lg">
            {siteContent.firm.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brass" />
              {siteContent.firm.yearsExperience}+ years of experience
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brass/80" />
              Approximately 10-person professional team
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {siteContent.heroPillars.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <Link href="/#contact" className="button-primary text-center">
              Request a Consultation
            </Link>
            <Link href="/services" className="button-secondary text-center">
              Explore Services
            </Link>
          </div>
        </div>

        <div className="animate-fade-up-delayed panel-card p-5 sm:p-6">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
            <div className="relative">
              <Image
                src="/hero-desk-stock.jpg"
                alt="Desk setup with calculator, pen, and paperwork for Nayyar and Nayyar Co."
                width={1024}
                height={768}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.62))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(184,145,70,0.22),transparent_24%)]" />
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
              {siteContent.metrics.map((metric) => (
                <div key={metric.label} className="panel-card-soft p-5">
                  <p className="font-display text-3xl text-white">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 border-t border-white/10 px-6 py-6 sm:grid-cols-2 sm:px-8">
              <div className="panel-card-soft flex items-start gap-3 p-4">
                <MapPin size={18} className="mt-1 text-brass" />
                <div>
                  <p className="text-sm font-semibold text-white">Located in South Delhi</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Serving clients from New Delhi with a professional, accessible office base.
                  </p>
                </div>
              </div>
              <div className="panel-card-soft flex items-start gap-3 p-4">
                <ShieldCheck size={18} className="mt-1 text-brass" />
                <div>
                  <p className="text-sm font-semibold text-white">Boutique, partner-accessible practice</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    A small team structure helps keep communication direct, careful, and accountable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
