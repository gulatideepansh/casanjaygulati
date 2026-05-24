type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  variant?: "site" | "portal";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "site"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  if (variant === "portal") {
    return (
      <div className={alignment}>
        <h2 className="text-2xl font-semibold leading-8 text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-[42rem] text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={alignment}>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brass">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl leading-[1.08] text-ink sm:text-4xl md:text-[2.65rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-[42rem] text-[15px] leading-8 text-slate-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
