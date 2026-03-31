import { Mail, MapPinned, Phone } from "lucide-react";

import type { ContactCardItem, SiteContent } from "@/content/types";

export const contactCards: ContactCardItem[] = [
  {
    title: "Email",
    detail: "gulati@casanjaygulati.com",
    icon: Mail
  },
  {
    title: "Phone",
    detail: "+91 98999 83485",
    icon: Phone
  },
  {
    title: "Office Address",
    detail: "A-44 Basement, Amar Colony, Lajpat Nagar IV, New Delhi, Delhi 110024",
    icon: MapPinned
  }
];

export const inquiry: SiteContent["inquiry"] = {
  heading: "Consultations and professional enquiries.",
  description:
    "For appointments, tax matters, audit queries, and other professional requirements, you may write to us or contact the office directly."
};
