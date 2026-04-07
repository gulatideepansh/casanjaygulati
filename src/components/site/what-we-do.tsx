import Link from "next/link";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function WhatWeDo() {
  return (
    <section id="services" className="section-divider border-y border-white/10 bg-[rgba(255,255,255,0.02)]">
      <div className="section-shell py-24">
        <SectionHeading
          eyebrow="Services"
          title="Comprehensive professional services across audit, taxation, advisory, and regulatory support."
          description="Our services are designed to support clients through both recurring compliance needs and higher-value advisory matters, with clear scope and dependable execution."
        />
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {siteContent.servicesOverview.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.slug}
                className="grid gap-5 px-0 py-7 transition duration-300 hover:bg-white/[0.015] md:grid-cols-[64px_1fr_auto] md:items-start md:gap-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/10 text-brass">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-[2rem] leading-tight text-white">{item.title}</h3>
                  <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-300">{item.description}</p>
                </div>
                <Link
                  href={`/services/${item.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-brass transition duration-300 hover:text-white md:mt-3"
                >
                  Learn more
                </Link>
              </article>
            );
          })}
        </div>
        <div className="mt-10">
          <Link href="/services" className="button-secondary">
            View All Service Pages
          </Link>
        </div>
      </div>
    </section>
  );
}
