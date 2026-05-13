import Image from "next/image";
import Link from "next/link";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Overview() {
  const paragraphs = siteContent.about.description.split("\n\n");

  return (
    <section id="about" className="bg-[#f7f5ef] py-16 lg:py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
        <div className="overflow-hidden border border-[#d8d2c4] bg-white shadow-[0_16px_40px_rgba(8,36,61,0.08)]">
          <Image
            src="/hero-desk-stock.jpg"
            alt="Financial documents, calculator, and stationery"
            width={1200}
            height={1400}
            className="h-full min-h-[300px] w-full object-cover lg:min-h-[420px]"
          />
        </div>
        <div>
          <SectionHeading eyebrow="About" title="About NAYYAR & NAYYAR" description="" />
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-700">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/#services" className="text-link gap-2 text-brass">
              Know More About Us
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
          <div className="mt-10 grid gap-4 border-t border-[#d8d2c4] pt-8 sm:grid-cols-3">
            {siteContent.highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="border border-[#d8d2c4] bg-white p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center border border-ink/15 text-ink">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
