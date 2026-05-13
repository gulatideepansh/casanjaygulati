type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

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
