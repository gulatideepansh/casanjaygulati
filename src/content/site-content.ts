import { about, experience, heroPillars, highlights, metrics } from "@/content/sections/about";
import { contactCards, inquiry } from "@/content/sections/contact";
import { firm } from "@/content/sections/firm";
import { footer } from "@/content/sections/footer";
import { nav } from "@/content/sections/navigation";
import { branches, partners, team } from "@/content/sections/placeholders";
import { seo } from "@/content/sections/seo";
import { serviceDetails, servicesOverview } from "@/content/sections/services";
import type { SiteContent } from "@/content/types";

// Central assembled content object consumed by UI components.
// Update the small section files in src/content/sections/* instead of editing component logic.
export const siteContent: SiteContent = {
  firm,
  nav,
  highlights,
  heroPillars,
  about,
  servicesOverview,
  serviceDetails,
  branches,
  partners,
  team,
  metrics,
  experience,
  contactCards,
  inquiry,
  footer,
  seo
};
