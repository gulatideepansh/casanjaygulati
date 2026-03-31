import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Overview() {
  return (
    <section id="about" className="section-shell section-divider py-24">
      <div className="grid gap-12 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <SectionHeading
          eyebrow="About"
          title={siteContent.about.title}
          description={siteContent.about.description}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {siteContent.highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="panel-card hover-lift p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/12 text-brass">
                  <Icon size={22} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
