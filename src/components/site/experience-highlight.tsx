import { siteContent } from "@/content/site-content";

export function ExperienceHighlight() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white lg:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,36,61,0.96),rgba(8,36,61,0.78)),url('/hero-desk-stock.jpg')] bg-cover bg-center" />
      <div className="section-shell relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brass">
            {siteContent.experience.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
            Experience You Can Rely On
          </h2>
        </div>
        <div>
          <p className="max-w-3xl text-base leading-8 text-white/85">{siteContent.experience.description}</p>
          <div className="mt-8 grid gap-4">
            {siteContent.experience.points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 text-sm leading-7 text-white/90"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brass" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
