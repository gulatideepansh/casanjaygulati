import { BadgeDollarSign, Calculator, FileCheck2, FileSearch, ReceiptText, Scale } from "lucide-react";

import type { ServiceDetail, ServiceItem } from "@/content/types";

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "audit-assurance",
    title: "Audit & Assurance",
    description:
      "Comprehensive audit services covering statutory, internal, tax, bank, CAG, investigative, and CSR review assignments.",
    icon: FileCheck2,
    intro:
      "The firm provides audit and assurance support across statutory, internal, banking, tax, investigative, and review assignments for corporate and public sector clients.",
    bullets: [
      "Statutory Audits: The firm conducts Statutory Audits of several Public and Private Corporate clients, which are required to be conducted under the provision of The Companies Act, 1956 and various other statutes.",
      "Internal Audits: The firm undertakes Internal Audits for various corporates, with the object of bringing in efficiency in the functioning of an enterprise as-well-as in reducing costs. The processes are reviewed and the internal control systems are strengthened.",
      "Bank Audits, Concurrent Audits, Stock Audits, Income Leakage Audits: The firm is extensively involved in conducting of Statutory Bank Branch Audits, Concurrent Audits, Stock Audits, Third Party Audits, Income Leakage Audits, etc. for many Nationalized and Private Sector Banks.",
      "Tax Audits: The firm conducts Tax Audits as prescribed under the provisions of The Income Tax Act, 1961.",
      "Comptroller and Auditors General Audits (CAG): The firm is empanelled with CAG and has conducted Statutory and Tax Audits for various Government Organisations and Public Sector Undertakings.",
      "Special/Investigative Audits: The firm conducts Concurrent Audits of Clients on behalf of Nationalised Banks for monitoring their performance. The firm conducts audits on behalf of the Office of the Official Liquidator in respect of Amalgamation/Merger of companies.",
      "CSR Review: The firm conducts Corporate Social Responsibility Review of Corporates required to spend the CSR expenditure through implementing agencies or by their self."
    ],
    suitableFor: ["Corporate audits", "Bank audits", "Government assignments"],
    image: "/service-audit-assurance.png",
    imageAlt: "Professional audit desk with reports, calculator, and financial review documents"
  },
  {
    slug: "direct-tax",
    title: "Direct Tax",
    description:
      "Direct tax advisory, compliance, and litigation support for businesses navigating the Indian tax framework.",
    icon: Calculator,
    intro:
      "There are number of complexities involved in Indian tax structure which make it difficult to manage an expanding business. We at Nayyar & Nayyar, assists businesses on various tax and regulatory matters at every stage of the business lifecycle, thereby enabling them to explore and make the most out of the opportunities. From advisory on complex tax structure through compliance to litigation, we can collaborate with you in each exercise to deliver a productive result.",
    bullets: [],
    suitableFor: ["Business taxation", "Compliance", "Litigation support"],
    image: "/service-direct-tax.png",
    imageAlt: "Indian direct tax advisory workspace with documents and compliance notes"
  },
  {
    slug: "corporate-taxation-advisory",
    title: "Corporate Taxation Advisory Services",
    description:
      "Corporate taxation support for transaction-stage planning, tax updates, and effective management of intricate tax matters.",
    icon: BadgeDollarSign,
    intro:
      "Our corporate taxation advisory services support transaction-stage planning, tax updates, and effective tax management for complex corporate matters.",
    bullets: [
      "Advisory at the transaction stage for tax efficiency on various intricate matters",
      "Updating on the new amendments, notifications, circulars and judgments",
      "Analysis of implications of MAT, Dividend Taxes, Advance Tax, etc.",
      "Providing Effective Tax Management and Advisory Services to Large Companies/ Corporations on various Tax matters including Foreign Taxation"
    ],
    suitableFor: ["Large companies", "Corporate tax matters", "Transaction planning"],
    image: "/service-corporate-taxation.png",
    imageAlt: "Corporate taxation strategy papers with charts and advisory documents"
  },
  {
    slug: "tax-planning",
    title: "Tax Planning",
    description:
      "Tax planning support for complex transactions, treaty issues, anti-avoidance provisions, and acquisition-related considerations.",
    icon: ReceiptText,
    intro:
      "Our tax planning services support complex business arrangements and transactions with a focus on future implications and efficient structuring.",
    bullets: [
      "Solutions for complex transactions or business arrangements, including advice on mergers, acquisitions and other forms of business reorganization",
      "Advice in relation to tax treaty and anti-avoidance provisions applicable to transactions",
      "Advice on future tax implications in respect of the potential acquisition."
    ],
    suitableFor: ["Business reorganisation", "Treaty matters", "Acquisition planning"],
    image: "/service-tax-planning.png",
    imageAlt: "Tax planning session with transaction documents, charts, and acquisition notes"
  },
  {
    slug: "corporate-services",
    title: "Corporate Services",
    description:
      "Corporate law, secretarial, and compliance services from incorporation through ongoing corporate matters and regulatory requirements.",
    icon: FileSearch,
    intro:
      "Nayyar & Nayyar offers its services right from the inception of a company to daily corporate matters & compliances.\n\nOur firm's well developed expertise in Companies Act, LLP Act & related laws enables us to handle complex transactions & compliance requirements.\n\nKey Services Offered Are:",
    bullets: [
      "Incorporation of a Company, LLP or proprietary concern.",
      "Assistance in filing of annual return & various regulatory requirements",
      "Assistance in drafting of Shareholder's Agreement, partnership agreement and Legal Agreements.",
      "Advising on issuance of Bonus/Rights issue of shares",
      "Supporting in secretarial matters including share transfers",
      "Winding up of the company/ LLP",
      "Valuation of Shares as required under the Companies Act on various transactions.",
      "Advising on distribution of Dividend.",
      "Conversion of Private Company into Public Company or vice-versa",
      "Conversion of Section 8 Companies into private company.",
      "Conversion of LLP into Private Company or vice-versa",
      "Change of Name/ Address or Object Clause of the Company",
      "Maintenance of Statutory Books including Minute books and Registers"
    ],
    suitableFor: ["Companies", "LLPs", "Corporate compliance"],
    image: "/service-corporate-services.png",
    imageAlt: "Corporate compliance desk with incorporation papers, registers, and legal documents"
  },
  {
    slug: "representation-services",
    title: "Representation Services",
    description:
      "Professional representation before the income tax department for rectification, assessments, appeals, litigation, and related matters.",
    icon: Scale,
    intro:
      "Our representation services cover departmental liaison, assessments, appeals, specialised litigation, and procedural tax matters requiring experienced follow-through.",
    bullets: [
      "Liaison with Income tax department for rectification, assessment, obtaining refunds etc.",
      "Expertise in complicated direct tax assessments.",
      "Filing and pleading appeals under various provisions of IT Act.",
      "Special expertise in search, seizure and prosecution litigation.",
      "Advance Ruling",
      "Obtaining of Lower rate TDS Certificates"
    ],
    suitableFor: ["Assessments", "Appeals", "Tax litigation"],
    image: "/service-representation-services.png",
    imageAlt: "Professional tax representation meeting with case files and financial records"
  }
];

export const servicesOverview: ServiceItem[] = serviceDetails.map(
  ({ slug, title, description, icon }) => ({
    slug,
    title,
    description,
    icon
  })
);
