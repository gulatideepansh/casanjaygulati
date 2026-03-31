import Image from "next/image";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Partners() {
  return (
    <section id="partners" className="section-divider border-y border-white/10 bg-[#091321]">
      <div className="section-shell py-24">
        <SectionHeading
          eyebrow="Partners"
          title="Partner profiles"
          description="This section may be updated with partner photographs, qualifications, areas of practice, and brief professional profiles."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {siteContent.partners.map((partner) => (
            <article key={partner.name} className="panel-card hover-lift p-8">
              {partner.image ? (
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={1200}
                  height={1200}
                  className="mx-auto h-[24rem] w-auto rounded-[1.25rem] object-contain object-top"
                />
              ) : (
                <div className="flex h-[24rem] items-center justify-center rounded-[1.25rem] bg-white/[0.03] font-display text-3xl text-brass">
                  Partner Photograph
                </div>
              )}
              <h3 className="mt-6 font-display text-[2rem] text-white">{partner.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.35em] text-brass">{partner.role}</p>
              <p className="mt-5 text-base leading-7 text-slate-300">{partner.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
