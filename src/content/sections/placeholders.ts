import type { BranchItem, PartnerItem, SiteContent } from "@/content/types";

function createGoogleMapsLink(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

function createGoogleMapsEmbedLink(query: string) {
  return `https://maps.google.com/maps?output=embed&iwloc=B&z=17&q=${encodeURIComponent(query)}`;
}

export const branches: BranchItem[] = [
  {
    name: "Lajpat Nagar Office",
    address: "A-44, Basement, Amar Colony, Lajpat Nagar IV, New Delhi, Delhi 110024,\nIndia",
    note: "Primary office for client meetings, tax matters, audit discussions, and ongoing professional coordination.",
    mapLink: createGoogleMapsLink(
      "Nayyar & Nayyar, A-44, Basement, Amar Colony, Lajpat Nagar IV, New Delhi, Delhi 110024, India"
    ),
    mapEmbedLink: createGoogleMapsEmbedLink(
      "Nayyar & Nayyar, A-44, Basement, Amar Colony, Lajpat Nagar IV, New Delhi, Delhi 110024, India"
    )
  },
  {
    name: "Karol Bagh Office",
    address: "Efforts Polymers Private Limited, 82/3 Joshi Rd, Block 63, Karol Bagh, New Delhi, Delhi 110005, India",
    note: "Additional office presence supporting accessibility and professional coordination across Delhi.",
    mapLink: createGoogleMapsLink(
      "Efforts Polymers Private Limited, 82/3 Joshi Rd, Block 63, Karol Bagh, New Delhi, Delhi 110005, India"
    ),
    mapEmbedLink: createGoogleMapsEmbedLink(
      "Efforts Polymers Private Limited, 82/3 Joshi Rd, Block 63, Karol Bagh, New Delhi, Delhi 110005, India"
    )
  }
];

export const partners: PartnerItem[] = [
  {
    name: "Sanjay Gulati",
    role: "Chartered Accountant",
    designation: "Chartered Accountant",
    qualifications: "B.Com, FCA",
    description:
      "Sanjay Gulati advises clients on tax, compliance, and business matters with a focus on practical guidance, responsiveness, and long-term professional relationships.",
    image: "/sanjay-gulati.png"
  },
  {
    name: "Pavan Gulati",
    role: "Chartered Accountant",
    designation: "Chartered Accountant",
    qualifications: "B.Com, FCA, DISA",
    description:
      "Pavan Gulati supports clients across finance, compliance, and advisory requirements with attention to detail, disciplined execution, and professional continuity.",
    image: "/pawan-gulati.png"
  }
];

export const team: SiteContent["team"] = {
  title: "A focused professional team supporting timely delivery and consistent client communication.",
  description:
    "The practice is supported by a close-knit team that assists with documentation, compliance workflows, coordination, and day-to-day execution across client assignments.",
  categories: [
    "Accounts and reporting support",
    "Tax and compliance coordination",
    "Documentation and filing workflows",
    "Client communication and follow-up"
  ],
  note: "The firm combines partner oversight with a dependable operational team to ensure matters are handled carefully and on schedule."
};
