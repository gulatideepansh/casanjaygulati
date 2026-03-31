import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Branches() {
  return (
    <section id="branches" className="section-shell section-divider py-24">
      <SectionHeading
        eyebrow="Branches"
        title="Branch offices"
        description="Additional office locations may be listed here with address details, contact information, and local service coverage."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {siteContent.branches.map((branch, index) => (
          <article key={branch.name} className="panel-card hover-lift p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-brass">Branch {index + 1}</p>
            <h3 className="mt-4 font-display text-[2rem] text-white">{branch.name}</h3>
            <p className="mt-4 text-base leading-7 text-slate-300">{branch.address}</p>
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-black/10 p-5">
              <p className="text-sm leading-7 text-slate-400">{branch.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
