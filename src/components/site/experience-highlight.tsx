import { siteContent } from "@/content/site-content";

export function ExperienceHighlight() {
  return (
    <section className="section-shell py-16">
      <div className="grid gap-10 border-y border-white/10 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-brass">
            {siteContent.experience.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-white sm:text-5xl">
            {siteContent.experience.title}
          </h2>
        </div>
        <div>
          <p className="max-w-3xl text-base leading-8 text-slate-200">{siteContent.experience.description}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {siteContent.experience.points.map((point) => (
              <div key={point} className="border-l border-brass/35 pl-4 text-sm leading-7 text-slate-200">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
