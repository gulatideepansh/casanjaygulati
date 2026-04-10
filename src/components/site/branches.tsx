import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Branches() {
  return (
    <section id="branches" className="section-shell section-divider py-24">
      <SectionHeading
        eyebrow="Branches"
        title="Office locations"
        description="Clients may connect with the firm through its Delhi office locations for meetings, documentation, and ongoing professional coordination."
      />
      <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-2">
        {siteContent.branches.map((branch, index) => (
          <article key={branch.name} className="border-l border-white/10 pl-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brass">Office {index + 1}</p>
            <h3 className="mt-4 font-display text-[2rem] text-white">{branch.name}</h3>
            <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-7 text-slate-300">{branch.address}</p>
            {branch.mapEmbedLink ? (
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-brass">Office Location</p>
                  {branch.mapLink ? (
                    <a
                      href={branch.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white transition duration-300 hover:text-brass"
                    >
                      Open in Google Maps
                    </a>
                  ) : null}
                </div>
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">
                  <iframe
                    title={`${branch.name} map`}
                    src={branch.mapEmbedLink}
                    className="h-[280px] w-full"
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
                className="mt-6 inline-flex text-sm font-semibold text-brass transition duration-300 hover:text-white"
              >
                Open in Google Maps
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
