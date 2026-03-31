import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Team() {
  return (
    <section id="team" className="section-shell section-divider py-24">
      <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_0.9fr]">
        <SectionHeading
          eyebrow="Staff"
          title={siteContent.team.title}
          description={siteContent.team.description}
        />
        <div className="panel-card p-8">
          <p className="text-xs uppercase tracking-[0.42em] text-brass">Future Staff Listing</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {siteContent.team.categories.map((category) => (
              <div key={category} className="panel-card-soft px-5 py-4 text-slate-200">
                {category}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/10 p-5">
            <p className="text-sm leading-7 text-slate-400">{siteContent.team.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
