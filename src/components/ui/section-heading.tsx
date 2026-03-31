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
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";

  return (
    <div className={alignment}>
      <p className="text-xs font-semibold uppercase tracking-[0.42em] text-brass">{eyebrow}</p>
      <h2 className="mt-5 font-display text-3xl leading-[1.08] text-slate-50 sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-[40rem] text-[15px] leading-8 text-slate-300 sm:text-base">
        {description}
      </p>
    </div>
  );
}
