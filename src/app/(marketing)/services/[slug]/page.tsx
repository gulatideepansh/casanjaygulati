import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

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
    <main className="bg-[#f7f5ef] pb-20 lg:pb-24">
      <section className="grid bg-white lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-shell flex items-center py-14 lg:py-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Services</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-6xl">
              {service.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-700">{service.description}</p>
            <Link href="/#contact" className="button-primary mt-8 gap-3">
              Request a Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px] lg:min-h-[520px]">
          <Image
            src={service.image ?? "/hero-desk-stock.jpg"}
            alt={service.imageAlt ?? service.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
      </section>

      <section className="section-shell pt-10 lg:pt-12">
        <div className="mx-auto max-w-5xl">
          <div className="border border-[#d8d2c4] bg-white p-5 sm:p-7 lg:p-8">
            <div className="space-y-6 text-base leading-8 text-slate-700">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {service.bullets.length > 0 ? (
              <div className="mt-10 border-t border-[#d8d2c4] pt-8">
                <h2 className="font-display text-2xl text-ink">Our Services Include</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Check className="mt-1 shrink-0 text-brass" size={17} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-12 flex flex-wrap gap-3 border-t border-[#d8d2c4] pt-8">
            <Link href="/services" className="button-secondary">
              Back to Services
            </Link>
            <Link href="/#contact" className="button-primary gap-3">
              Request a Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
