import Link from "next/link";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function WhatWeDo() {
  return (
    <section id="services" className="section-divider border-y border-white/10 bg-white/5">
      <div className="section-shell py-24">
        <SectionHeading
          eyebrow="Services"
          title="A broad service architecture for compliance, advisory, tax, and transaction support."
          description="The firm now presents a fuller service structure with dedicated pages for each practice area, making it easier for clients to understand the scope of work beyond a short homepage summary."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {siteContent.servicesOverview.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.slug} className="panel-card hover-lift bg-[#0b1628] p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brass/12 text-brass">
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 font-display text-[2rem] leading-tight text-white">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-slate-300">{item.description}</p>
                <Link
                  href={`/services/${item.slug}`}
                  className="mt-6 inline-flex text-sm font-semibold text-brass transition duration-300 hover:text-white"
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
