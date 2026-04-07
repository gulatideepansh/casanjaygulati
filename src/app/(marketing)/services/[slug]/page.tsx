import Image from "next/image";
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

  const paragraphs = service.intro
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="pb-20 lg:pb-24">
      <section className="relative overflow-hidden">
        <Image
          src={service.image ?? "/hero-desk-stock.jpg"}
          alt={service.imageAlt ?? service.title}
          width={1600}
          height={640}
          className="h-[460px] w-full bg-[#08111d] object-contain object-center sm:h-[580px] lg:h-[720px]"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,23,0.08),rgba(6,13,23,0.34))]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(6,13,23,0),rgba(7,17,29,0.98))]" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="section-shell pb-16 pt-24 text-center lg:pb-20 lg:pt-28">
            <p className="text-xs uppercase tracking-[0.3em] text-brass">Services</p>
            <h1 className="mx-auto mt-4 max-w-5xl font-display text-5xl leading-tight text-white sm:text-6xl">
              {service.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="section-shell pt-10">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 text-base leading-8 text-slate-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {service.bullets.length > 0 ? (
            <div className="mt-10 border-t border-white/10 pt-8">
              <ul className="space-y-5 text-base leading-8 text-slate-300">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="border-l border-brass/35 pl-5">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <Link href="/services" className="button-secondary">
              Back to Services
            </Link>
            <Link href="/#contact" className="button-primary">
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
