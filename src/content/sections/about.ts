import { BriefcaseBusiness, Landmark, ShieldCheck } from "lucide-react";

import type { HighlightItem, SiteContent } from "@/content/types";

export const highlights: HighlightItem[] = [
  {
    title: "More Than 3 Decades of Practice",
    description:
      "A long-established practice built on continuity, professional discipline, and trusted client relationships developed over decades.",
    icon: Landmark
  },
  {
    title: "Partner-Led Service",
    description:
      "Assignments are handled with direct senior involvement, giving clients clear communication and accountable professional oversight.",
    icon: BriefcaseBusiness
  },
  {
    title: "Compliance-First Mindset",
    description:
      "Work is approached with attention to timeliness, documentation, confidentiality, and dependable execution at every stage.",
    icon: ShieldCheck
  }
];

export const heroPillars: string[] = [
  "Audit and assurance services",
  "Direct and indirect tax support",
  "Corporate advisory and transaction assistance",
  "Company law and regulatory compliance"
];

export const about: SiteContent["about"] = {
  title: "About Us",
  description:
    "Nayyar & Nayyar, Chartered Accountants, has been serving clients since 1974 and expanded its practice base through merger on 1 January 2015.\n\nThe firm is a well-regarded chartered accountancy practice providing a comprehensive range of professional services, including direct and indirect taxation, GST, audit and assurance, mergers and acquisitions, corporate advisory, and financial services for clients in India and overseas.\n\nFor more than 3 decades, our commitment has been to deliver professional services of the highest standard, create measurable value for clients, and uphold the ethics and integrity of the profession through responsive, personalised advice."
};

export const metrics: SiteContent["metrics"] = [
  { label: "Years of practice", value: "34+ years" },
  { label: "Core service lines", value: "12" },
  { label: "Planned branch locations", value: "2" },
  { label: "Team structure", value: "25+ professionals" }
];

export const experience: SiteContent["experience"] = {
  eyebrow: "Experience",
  title: "Professional support for businesses, promoters, and families navigating compliance and growth with confidence.",
  description:
    "We work with clients who need more than routine filing support. The firm assists with ongoing compliance, tax planning, representation matters, business advisory, and transaction-linked requirements through a service model that values clarity, responsiveness, and continuity.",
  points: [
    "Support for individuals, owner-managed businesses, SMEs, and corporate entities",
    "Coverage across audit, tax, advisory, representation, and company law matters",
    "Responsive service with direct access to senior professionals"
  ]
};
