import type { Metadata } from "next";
import Link from "next/link";

import { siteContent } from "@/content/site-content";

export const metadata: Metadata = {
  title: `Services | ${siteContent.firm.name}`,
  description:
    "Explore the firm's audit, tax, advisory, representation, international tax, and corporate service offerings."
};

export default function ServicesPage() {
  return (
    <main className="section-shell py-20 lg:py-24">
      <section className="panel-card p-8 sm:p-10 lg:p-14">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">Services</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">
          A broader professional services platform for business, compliance, and transaction needs.
        </h1>
        <p className="mt-6 max-w-3xl text-[17px] leading-8 text-slate-300">
          This service architecture is inspired by the breadth common to established chartered accountancy
          firms, but the content here is written specifically for {siteContent.firm.name}. Each page gives
          a clearer picture of how the firm can support clients beyond a short homepage summary.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {siteContent.serviceDetails.map((service) => {
          const Icon = service.icon;

          return (
            <article key={service.slug} className="panel-card hover-lift p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brass/12 text-brass">
                <Icon size={24} />
              </div>
              <h2 className="mt-6 font-display text-[2rem] leading-tight text-white">{service.title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-300">{service.description}</p>
              <p className="mt-5 text-sm leading-7 text-slate-400">{service.intro}</p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-7 inline-flex text-sm font-semibold text-brass transition duration-300 hover:text-white"
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
