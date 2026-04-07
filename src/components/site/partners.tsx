import Image from "next/image";

import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Partners() {
  return (
    <section id="partners" className="section-divider border-y border-white/10 bg-[#091321]">
      <div className="section-shell py-24">
        <SectionHeading
          eyebrow="Partners"
          title="Leadership with hands-on professional involvement"
          description="The firm is led by experienced chartered accountants who remain closely involved in client matters and long-term advisory relationships."
        />
        <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
          {siteContent.partners.map((partner) => (
            <article key={partner.name} className="grid gap-8 py-8 lg:grid-cols-[280px_1fr] lg:items-start">
              <div>
                {partner.image ? (
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={1200}
                    height={1200}
                    className="h-[20rem] w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 object-contain object-top"
                  />
                ) : (
                  <div className="flex h-[20rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.03] font-display text-3xl text-brass">
                    Partner Photograph
                  </div>
                )}
              </div>
              <div className="max-w-3xl">
                <h3 className="font-display text-[2.2rem] text-white">{partner.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-brass">
                  {partner.designation ?? partner.role}
                </p>
                {partner.qualifications ? (
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    Qualifications: {partner.qualifications}
                  </p>
                ) : null}
                <p className="mt-6 text-base leading-8 text-slate-300">{partner.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
