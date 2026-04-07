import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type HighlightItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceDetail = ServiceItem & {
  intro: string;
  bullets: string[];
  suitableFor: string[];
  image?: string;
  imageAlt?: string;
};

export type BranchItem = {
  name: string;
  address: string;
  note: string;
  mapLink?: string;
};

export type PartnerItem = {
  name: string;
  role: string;
  designation?: string;
  qualifications?: string;
  description: string;
  image?: string;
};

export type ContactCardItem = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

export type SiteContent = {
  firm: {
    name: string;
    domain: string;
    tagline: string;
    description: string;
    yearsExperience: string;
    location: string;
    address: string;
    email: string;
    phone: string;
    futureNote: string;
  };
  nav: NavItem[];
  highlights: HighlightItem[];
  heroPillars: string[];
  about: {
    title: string;
    description: string;
  };
  servicesOverview: ServiceItem[];
  serviceDetails: ServiceDetail[];
  branches: BranchItem[];
  partners: PartnerItem[];
  team: {
    title: string;
    description: string;
    categories: string[];
    note: string;
  };
  metrics: Array<{
    label: string;
    value: string;
  }>;
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
  };
  contactCards: ContactCardItem[];
  inquiry: {
    heading: string;
    description: string;
  };
  contactForm: {
    provider: "web3forms";
    accessKey: string;
    subject: string;
    fromName: string;
  };
  footer: {
    services: string[];
    copyright: string;
  };
  seo: {
    title: string;
    description: string;
  };
};
