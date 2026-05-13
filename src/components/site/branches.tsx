import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Branches() {
  return (
    <section id="branches" className="bg-[#f7f5ef] py-16 lg:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Branches"
          title="Our Branches"
          description="Clients may connect with the firm through its Delhi office locations for meetings, documentation, and ongoing professional coordination."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {siteContent.branches.map((branch, index) => (
            <article key={branch.name} className="border border-[#d8d2c4] bg-white p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Office {index + 1}</p>
              <h3 className="mt-4 font-display text-[2rem] text-ink">{branch.name}</h3>
              <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-7 text-slate-600">{branch.address}</p>
            {branch.mapEmbedLink ? (
              <div className="mt-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Office Location</p>
                  {branch.mapLink ? (
                    <a
                      href={branch.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-link"
                    >
                      Open in Google Maps
                    </a>
                  ) : null}
                </div>
                <div className="overflow-hidden border border-[#d8d2c4] bg-white">
                  <iframe
                    title={`${branch.name} map`}
                    src={branch.mapEmbedLink}
                    className="h-[260px] w-full sm:h-[300px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : branch.mapLink ? (
              <a
                href={branch.mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-link mt-6"
              >
                Open in Google Maps
              </a>
            ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
