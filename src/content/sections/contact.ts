import { Mail, MapPinned, Phone } from "lucide-react";

import type { ContactCardItem, SiteContent } from "@/content/types";

export const contactCards: ContactCardItem[] = [
  {
    title: "Email",
    detail: "casanjaygulati@gmail.com",
    icon: Mail
  },
  {
    title: "Phone",
    detail: "+91 011 4102 6688",
    icon: Phone
  },
  {
    title: "Office Address",
    detail: "A-44, Basement, Amar Colony, Lajpat Nagar IV, New Delhi, Delhi 110024, India",
    icon: MapPinned
  }
];

export const inquiry: SiteContent["inquiry"] = {
  heading: "Consultations and professional enquiries",
  description:
    "For appointments, tax matters, audit queries, and other professional requirements, please write to us with a brief summary and our office will respond."
};

export const contactForm: SiteContent["contactForm"] = {
  provider: "web3forms",
  accessKey: "2c085c23-5b78-480e-bd8c-70e24de98391",
  subject: "New website enquiry - Nayyar and Nayyar",
  fromName: "Nayyar and Nayyar Website"
};
