import type { Metadata } from "next";
import Link from "next/link";

import { siteContent } from "@/content/site-content";

export const metadata: Metadata = {
  title: `Services | ${siteContent.firm.name}`,
  description:
    "Explore the firm's audit, direct tax, corporate taxation advisory, tax planning, corporate services, and representation service offerings."
};

export default function ServicesPage() {
  return (
    <main className="section-shell py-20 lg:py-24">
      <section className="border-b border-white/10 pb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">Services</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">
          Professional services for compliance, advisory, tax, and transaction-related requirements.
        </h1>
        <p className="mt-6 max-w-3xl text-[17px] leading-8 text-slate-300">
          Our service portfolio is built around the practical needs of businesses, promoters, and
          individuals who require dependable support across audit, taxation, regulatory compliance,
          corporate matters, and business decision-making. Each service page outlines how the firm can
          assist in a clear and structured manner.
        </p>
      </section>

      <section className="divide-y divide-white/10">
        {siteContent.serviceDetails.map((service) => {
          const Icon = service.icon;
          const introPreview = service.intro
            .split("\n\n")
            .map((paragraph) => paragraph.trim())
            .find(Boolean);

          return (
            <article
              key={service.slug}
              className="grid gap-6 py-8 md:grid-cols-[72px_1fr_auto] md:items-start md:gap-8"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brass/10 text-brass">
                <Icon size={24} />
              </div>
              <div className="max-w-4xl">
                <h2 className="font-display text-[2.2rem] leading-tight text-white">{service.title}</h2>
                <p className="mt-3 text-[15px] leading-7 text-slate-300">{service.description}</p>
                {introPreview ? (
                  <p className="mt-4 max-w-3xl border-l border-brass/35 pl-4 text-sm leading-8 text-slate-400">
                    {introPreview}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center text-sm font-semibold text-brass transition duration-300 hover:text-white md:mt-3"
              >
                Open service page
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
