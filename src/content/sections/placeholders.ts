import type { BranchItem, PartnerItem, SiteContent } from "@/content/types";

export const branches: BranchItem[] = [
  {
    name: "Office Location",
    address: "Address details may be updated here.",
    note: "This section may include the office address, contact person, business hours, and location details."
  },
  {
    name: "Office Location",
    address: "Address details may be updated here.",
    note: "Local contact details and service coverage information may be added here for the branch office."
  }
];

export const partners: PartnerItem[] = [
  {
    name: "Sanjay Gulati",
    role: "Designation and qualifications",
    description:
      "A brief professional profile may be added here, including qualifications, areas of practice, and the partner's experience in advising clients.",
    image: "/sanjay-gulati.png"
  },
  {
    name: "Pawan Gulati",
    role: "Designation and qualifications",
    description:
      "This space may be used for a concise introduction covering sector experience, practice focus, and representative professional work.",
    image: "/pawan-gulati.png"
  }
];

export const team: SiteContent["team"] = {
  title: "Staff & Team Listing",
  description:
    "This section is intentionally structured for future staff profiles, department groupings, and a more detailed directory for a close-knit 10-person practice.",
  categories: [
    "Staff profile placeholder 1",
    "Staff profile placeholder 2",
    "Department / role placeholder",
    "Additional team details to be updated"
  ],
  note: "Detailed staff names, roles, departments, photos, and profile information will be updated later."
};
