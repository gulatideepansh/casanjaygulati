import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function WhatWeDo() {
  return (
    <section id="services" className="bg-white py-16 lg:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Services"
          title="Our Services"
          description="Our services are designed to support clients through both recurring compliance needs and higher-value advisory matters, with clear scope and dependable execution."
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {siteContent.servicesOverview.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.slug}
                className="group flex min-h-[230px] flex-col items-center border border-[#d8d2c4] bg-white p-6 text-center shadow-[0_12px_28px_rgba(8,36,61,0.06)] transition hover:-translate-y-1 hover:border-brass"
              >
                <div className="flex h-16 w-16 items-center justify-center border border-ink/20 text-ink transition group-hover:border-brass group-hover:text-brass">
                  <Icon size={30} />
                </div>
                <h3 className="mt-5 text-sm font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-slate-600">{item.description}</p>
                <Link
                  href={`/services/${item.slug}`}
                  className="mt-auto pt-5 text-xs font-semibold text-brass opacity-0 transition group-hover:opacity-100"
                >
                  Learn more
                </Link>
              </article>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="button-primary gap-3">
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
