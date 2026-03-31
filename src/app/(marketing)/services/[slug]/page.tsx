import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteContent } from "@/content/site-content";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getService(slug: string) {
  return siteContent.serviceDetails.find((service) => service.slug === slug);
}

export async function generateStaticParams() {
  return siteContent.serviceDetails.map((service) => ({
    slug: service.slug
  }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: `Service Not Found | ${siteContent.firm.name}`
    };
  }

  return {
    title: `${service.title} | ${siteContent.firm.name}`,
    description: service.description
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <main className="section-shell py-20 lg:py-24">
      <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="panel-card p-8 sm:p-10 lg:p-14">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brass/12 text-brass">
            <Icon size={30} />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-brass">Service Detail</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-3xl text-[17px] leading-8 text-slate-300">{service.intro}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services" className="button-secondary">
              Back to Services
            </Link>
            <Link href="/#contact" className="button-primary">
              Request a Consultation
            </Link>
          </div>
        </div>

        <aside className="panel-card p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">At a glance</p>
          <p className="mt-4 text-base leading-8 text-slate-300">{service.description}</p>
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="text-sm font-semibold text-white">Well suited for</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {service.suitableFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="panel-card p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-brass">Scope</p>
          <h2 className="mt-4 font-display text-4xl text-white">How this service can be presented on the website</h2>
          <div className="mt-8 space-y-4">
            {service.bullets.map((bullet) => (
              <div key={bullet} className="panel-card-soft flex items-start gap-4 p-5">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brass" />
                <p className="text-sm leading-7 text-slate-300">{bullet}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-brass">Positioning</p>
          <h2 className="mt-4 font-display text-4xl text-white">Original copy, similar business breadth</h2>
          <p className="mt-6 text-sm leading-8 text-slate-300">
            This page intentionally mirrors the breadth of services you pointed to, but it does not copy
            the source wording. That keeps your website safer, cleaner, and more credible while still
            giving you a comparable professional footprint.
          </p>
          <p className="mt-4 text-sm leading-8 text-slate-300">
            If you want, we can keep refining each service page with your actual processes, industries,
            partner names, turnaround expectations, and proof points so the site reads like your firm
            rather than a template.
          </p>
        </article>
      </section>
    </main>
  );
}
