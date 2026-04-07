import Image from "next/image";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Overview() {
  const paragraphs = siteContent.about.description.split("\n\n");

  return (
    <section id="about" className="section-shell section-divider py-24">
      <div className="grid gap-14 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
          <Image
            src="/hero-desk-stock.jpg"
            alt="Financial documents, calculator, and stationery"
            width={1200}
            height={1400}
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow="About" title={siteContent.about.title} description="" />
          <div className="mt-6 space-y-6 text-base leading-8 text-slate-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            {siteContent.highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className={`${index > 0 ? "sm:border-l sm:border-white/10 sm:pl-5" : ""}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10 text-brass">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
