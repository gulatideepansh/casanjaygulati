import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteContent } from "@/content/site-content";

export const metadata: Metadata = {
  title: `Services | ${siteContent.firm.name}`,
  description:
    "Explore the firm's audit, direct tax, corporate taxation advisory, tax planning, corporate services, and representation service offerings."
};

export default function ServicesPage() {
  return (
    <main className="bg-[#f7f5ef]">
      <section className="section-shell py-16 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Services</p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl leading-tight text-ink sm:text-6xl">
          Professional services for compliance, advisory, tax, and transaction-related requirements.
        </h1>
        <p className="mt-6 max-w-3xl text-[17px] leading-8 text-slate-700">
          Our service portfolio is built around the practical needs of businesses, promoters, and
          individuals who require dependable support across audit, taxation, regulatory compliance,
          corporate matters, and business decision-making. Each service page outlines how the firm can
          assist in a clear and structured manner.
        </p>
      </section>

      <section className="section-shell grid gap-0 pb-20 lg:pb-24">
        <div className="border border-[#d8d2c4] bg-white">
          {siteContent.serviceDetails.map((service) => {
            const Icon = service.icon;
            const introPreview = service.intro
              .split("\n\n")
              .map((paragraph) => paragraph.trim())
              .find(Boolean);

            return (
              <article
                key={service.slug}
                className="grid gap-5 border-b border-[#d8d2c4] p-5 last:border-b-0 md:grid-cols-[64px_1fr_auto] md:items-center md:gap-8 lg:p-7"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-ink/20 text-ink">
                  <Icon size={24} />
                </div>
                <div className="max-w-4xl">
                  <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{service.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{service.description}</p>
                  {introPreview ? (
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                      {introPreview}
                    </p>
                  ) : null}
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#d8d2c4] text-ink transition hover:border-brass hover:text-brass"
                  aria-label={`Open ${service.title} service page`}
                >
                  <ArrowRight size={18} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
