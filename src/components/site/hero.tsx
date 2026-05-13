import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteContent } from "@/content/site-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="section-shell relative z-10 flex items-center py-16 lg:py-24">
          <div className="max-w-xl animate-fade-up">
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl lg:text-[4.4rem]">
              Trusted Expertise. Practical Solutions.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-700">
              Audit, Taxation, Compliance and Corporate Services for Businesses, Promoters and Families.
            </p>
            <div className="mt-8">
              <Link href="/#contact" className="button-primary gap-3">
                Request a Consultation
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
        <div className="relative min-h-[320px] lg:min-h-full">
          <Image
            src="/hero-desk-stock.jpg"
            alt="Desk setup with calculator, pen, and paperwork for NAYYAR & NAYYAR"
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(255,255,255,0.18)_42%,rgba(255,255,255,0))] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
