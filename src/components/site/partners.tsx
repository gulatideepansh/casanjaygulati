import Image from "next/image";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Partners() {
  return (
    <section id="partners" className="bg-white py-16 lg:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Partners"
          title="Our Partners"
          description="The firm is led by experienced chartered accountants who remain closely involved in client matters and long-term advisory relationships."
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {siteContent.partners.map((partner) => (
            <article key={partner.name} className="border border-[#d8d2c4] bg-white text-center shadow-[0_12px_28px_rgba(8,36,61,0.06)]">
              <div>
                {partner.image ? (
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={1200}
                    height={1200}
                    className="h-[22rem] w-full bg-[#f2efe8] object-contain object-top"
                  />
                ) : (
                  <div className="flex h-[22rem] items-center justify-center bg-[#f2efe8] font-display text-3xl text-brass">
                    Partner Photograph
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl leading-tight text-ink">{partner.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {partner.designation ?? partner.role}
                </p>
                {partner.qualifications ? (
                  <p className="mt-3 text-sm font-medium text-slate-500">
                    Qualifications: {partner.qualifications}
                  </p>
                ) : null}
                <p className="mt-5 text-sm leading-7 text-slate-600">{partner.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
