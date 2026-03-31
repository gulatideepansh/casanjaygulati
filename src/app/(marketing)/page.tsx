import { Branches } from "@/components/site/branches";
import { Contact } from "@/components/site/contact";
import { ExperienceHighlight } from "@/components/site/experience-highlight";
import { Hero } from "@/components/site/hero";
import { Overview } from "@/components/site/overview";
import { Partners } from "@/components/site/partners";
import { WhatWeDo } from "@/components/site/what-we-do";

export default function HomePage() {
  return (
    <main>
      {/* Phase 1: public marketing website */}
      {/* Future portal and admin areas should live in separate route groups so the public shell
          remains isolated from authenticated layouts and server-side business logic. */}
      <Hero />
      <Overview />
      <WhatWeDo />
      <ExperienceHighlight />
      <Branches />
      <Partners />
      <Contact />
    </main>
  );
}
