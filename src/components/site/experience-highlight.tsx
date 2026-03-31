import { siteContent } from "@/content/site-content";

export function ExperienceHighlight() {
  return (
    <section className="section-shell py-10">
      <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(184,145,70,0.12),rgba(11,22,40,0.92))] p-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-brass">
            {siteContent.experience.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-white sm:text-5xl">
            {siteContent.experience.title}
          </h2>
        </div>
        <div>
          <p className="text-base leading-8 text-slate-200">{siteContent.experience.description}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {siteContent.experience.points.map((point) => (
              <div key={point} className="panel-card-soft p-4 text-sm leading-6 text-slate-200">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
