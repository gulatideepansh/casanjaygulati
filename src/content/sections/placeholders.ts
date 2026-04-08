import type { BranchItem, PartnerItem, SiteContent } from "@/content/types";

function createGoogleMapsLink(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

function createGoogleMapsEmbedLink(query: string) {
  return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(query)}`;
}

export const branches: BranchItem[] = [
  {
    name: "Lajpat Nagar Office",
    address: "A-44, Basement, Amar Colony, Lajpat Nagar 4, New Delhi 110024",
    note: "Primary office for client meetings, tax matters, audit discussions, and ongoing professional coordination.",
    mapLink: createGoogleMapsLink("A-44, Basement, Amar Colony, Lajpat Nagar 4, New Delhi 110024"),
    mapEmbedLink: createGoogleMapsEmbedLink("A-44, Basement, Amar Colony, Lajpat Nagar 4, New Delhi 110024")
  },
  {
    name: "Karol Bagh Office",
    address: "102, 82 Abhinash Mansion, Joshi Road, Karol Bagh, New Delhi 110005",
    note: "Additional office presence supporting accessibility and professional coordination across Delhi.",
    mapLink: createGoogleMapsLink("Abhinash Mansion, 82/3 Joshi Road, Karol Bagh, New Delhi 110005"),
    mapEmbedLink: createGoogleMapsEmbedLink("Abhinash Mansion, 82/3 Joshi Road, Karol Bagh, New Delhi 110005")
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
