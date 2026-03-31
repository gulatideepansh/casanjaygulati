import { BriefcaseBusiness, Landmark, ShieldCheck } from "lucide-react";

import type { HighlightItem, SiteContent } from "@/content/types";

export const highlights: HighlightItem[] = [
  {
    title: "35+ Years of Practice",
    description:
      "Built on long-standing professional credibility, disciplined execution, and steady client relationships across business cycles.",
    icon: Landmark
  },
  {
    title: "Partner-Led Service",
    description:
      "Client matters are handled with direct senior oversight, from recurring compliance work to higher-value advisory questions.",
    icon: BriefcaseBusiness
  },
  {
    title: "Compliance-First Mindset",
    description:
      "Processes are designed around reporting discipline, confidentiality, and dependable communication at every stage.",
    icon: ShieldCheck
  }
];

export const heroPillars: string[] = [
  "Audit, tax, and regulatory execution",
  "Corporate advisory and transaction support",
  "Cross-border and international tax guidance",
  "Company law and corporate compliance services"
];

export const about: SiteContent["about"] = {
  title: "A chartered accountancy practice built to support compliance, transactions, and long-term business decisions.",
  description:
    "Nayyar and Nayyar Co. serves individuals, entrepreneurs, SMEs, and business groups through a partner-led practice shaped by more than 35 years of experience. The firm supports clients across audit, direct tax, GST, corporate advisory, representation matters, company law support, and other recurring regulatory needs with an emphasis on practical execution and durable professional relationships."
};

export const metrics: SiteContent["metrics"] = [
  { label: "Years of practice", value: "35+" },
  { label: "Core service lines", value: "12" },
  { label: "Planned branch locations", value: "2" },
  { label: "Team structure", value: "Approx. 10 professionals" }
];

export const experience: SiteContent["experience"] = {
  eyebrow: "Experience",
  title: "Structured professional support for businesses, promoters, and families navigating growth and compliance.",
  description:
    "The firm is positioned to support both longstanding clients and growing businesses with practical advice, dependable turnaround, and service breadth that extends beyond basic annual filing work into planning, representation, advisory, and corporate support.",
  points: [
    "Support for individuals, family-owned businesses, startups, SMEs, and corporate clients",
    "Coverage across audit, direct tax, indirect tax, advisory, transaction, and company law requirements",
    "A close-knit team structure suited to thoughtful, relationship-led service with senior access"
  ]
};
