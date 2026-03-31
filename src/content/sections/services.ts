import {
  ArrowRightLeft,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  Calculator,
  FileCheck2,
  FileSearch,
  FolderKanban,
  Globe2,
  Handshake,
  ReceiptText,
  Scale
} from "lucide-react";

import type { ServiceDetail, ServiceItem } from "@/content/types";

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "audit-assurance",
    title: "Audit & Assurance",
    description:
      "Independent audit and review support designed to strengthen reporting confidence, governance discipline, and stakeholder trust.",
    icon: FileCheck2,
    intro:
      "Our audit and assurance work is structured to help businesses meet statutory expectations while also improving internal financial discipline and management visibility.",
    bullets: [
      "Statutory audits for companies, firms, and other reporting entities",
      "Internal audit reviews focused on process reliability and control gaps",
      "Financial statement review support and reporting readiness",
      "Coordination with management teams on observations, closures, and compliance priorities"
    ],
    suitableFor: ["Private companies", "Growing businesses", "Entities preparing for lender or board scrutiny"]
  },
  {
    slug: "corporate-financial-advisory",
    title: "Corporate & Financial Advisory",
    description:
      "Practical advisory support for business decisions involving finance, structuring, documentation, and transaction readiness.",
    icon: BriefcaseBusiness,
    intro:
      "We support businesses that need commercially grounded financial advice, whether the requirement is project-led, transaction-led, or connected to ongoing strategic planning.",
    bullets: [
      "Financial structuring and planning support",
      "Preparation support for lender discussions and information packs",
      "Advisory on business reorganization and capital planning",
      "Decision support on complex financial and regulatory matters"
    ],
    suitableFor: ["Owner-led businesses", "Established SMEs", "Companies preparing for institutional engagement"]
  },
  {
    slug: "direct-tax",
    title: "Direct Tax",
    description:
      "Direct tax advisory and compliance support covering planning, filings, assessments, and response management.",
    icon: Calculator,
    intro:
      "Direct tax work is handled with a focus on clarity, timeliness, and defensible positions across regular compliance and higher-stakes scrutiny matters.",
    bullets: [
      "Income-tax return planning and filing support",
      "Tax position review for individuals, firms, and companies",
      "Assessment support and notice-response coordination",
      "Advisory on deductions, structuring, and documentation discipline"
    ],
    suitableFor: ["Individuals and families", "Professionals", "Companies with recurring direct-tax obligations"]
  },
  {
    slug: "corporate-taxation-advisory",
    title: "Corporate Taxation Advisory",
    description:
      "Corporate tax guidance for business decisions, transactions, and compliance frameworks that require careful review.",
    icon: BadgeDollarSign,
    intro:
      "Corporate tax questions often sit at the intersection of legal form, documentation, timing, and commercial intent. Our approach is to help management evaluate these issues before they become expensive.",
    bullets: [
      "Tax review at the transaction-planning stage",
      "Advisory on tax efficiency for corporate decisions and arrangements",
      "Documentation support for defensible tax positions",
      "Coordination with finance and legal stakeholders on implementation"
    ],
    suitableFor: ["Companies entering new transactions", "Promoter-led groups", "Businesses restructuring arrangements"]
  },
  {
    slug: "representation-services",
    title: "Representation Services",
    description:
      "Professional representation before tax and regulatory authorities with a focus on preparation, response quality, and steady follow-through.",
    icon: Scale,
    intro:
      "Where matters involve departmental correspondence, hearings, or follow-up with authorities, we support clients through structured preparation and informed representation.",
    bullets: [
      "Representation in assessment and compliance proceedings",
      "Drafting and review of submissions, replies, and supporting papers",
      "Follow-up coordination with departments and professional counterparts",
      "Case handling support grounded in records, timelines, and procedural discipline"
    ],
    suitableFor: ["Businesses under review", "Clients receiving notices", "Entities needing ongoing authority coordination"]
  },
  {
    slug: "tax-planning",
    title: "Tax Planning",
    description:
      "Forward-looking tax planning aligned to business realities, family objectives, and practical compliance execution.",
    icon: ReceiptText,
    intro:
      "Tax planning is most effective when it is commercially sensible, well documented, and integrated into the way a client already operates. We focus on plans that can actually be maintained.",
    bullets: [
      "Review of tax impact before major financial decisions",
      "Planning support for individuals, proprietors, firms, and companies",
      "Coordination of compliance consequences alongside planning recommendations",
      "Advisory shaped around sustainability, not just one-time savings"
    ],
    suitableFor: ["Decision-makers planning major transactions", "Families organizing wealth and income flows", "Businesses aiming for cleaner tax positions"]
  },
  {
    slug: "other-tax-compliance-services",
    title: "Other Tax Compliance Services",
    description:
      "Support for recurring tax compliance obligations, record discipline, and process coordination across reporting cycles.",
    icon: FolderKanban,
    intro:
      "Beyond advisory, businesses need regular execution. We help organize tax compliance work so filings, reconciliations, and records remain manageable across the year.",
    bullets: [
      "Periodic compliance support and reporting coordination",
      "Working-paper and document discipline for recurring obligations",
      "Liaison support with internal finance teams and external stakeholders",
      "Cleanup and regularization support for delayed or disorganized compliance"
    ],
    suitableFor: ["Businesses with thin in-house finance capacity", "Teams needing periodic CA support", "Clients regularizing legacy issues"]
  },
  {
    slug: "entry-level-strategy",
    title: "Entry Level Strategy",
    description:
      "Early-stage advisory for new ventures and business entrants who need practical guidance on setup, structure, and first-step compliance.",
    icon: Building2,
    intro:
      "New businesses often need more than registration support. They need a sensible first framework for tax, records, statutory basics, and financial habits that will scale with growth.",
    bullets: [
      "Advisory on starting structure and early compliance priorities",
      "Foundational guidance on records, registrations, and financial processes",
      "Support in sequencing first-year statutory requirements",
      "Practical handholding for promoters and first-time founders"
    ],
    suitableFor: ["Startups", "First-generation entrepreneurs", "Businesses formalizing their operations"]
  },
  {
    slug: "outbound-advisory",
    title: "Outbound Advisory",
    description:
      "Support for businesses with cross-border ambitions, overseas dealings, and outward expansion-related compliance questions.",
    icon: ArrowRightLeft,
    intro:
      "Cross-border activity creates layered tax, documentation, and regulatory questions. We help clients understand those requirements before execution pressure sets in.",
    bullets: [
      "Advisory on outward business activity and related compliance implications",
      "Coordination support on remittance, documentation, and reporting aspects",
      "Review of commercial arrangements with a regulatory lens",
      "Pre-transaction guidance for outbound structuring questions"
    ],
    suitableFor: ["Indian businesses expanding abroad", "Clients exploring foreign commercial arrangements", "Promoters planning outbound transactions"]
  },
  {
    slug: "merger-acquisition",
    title: "Merger & Acquisition",
    description:
      "Transaction-oriented support for mergers, acquisitions, reorganizations, and related business transition decisions.",
    icon: Handshake,
    intro:
      "M&A work demands coordination across finance, tax, legal, and management priorities. We help clients approach those decisions with discipline, documentation, and decision support at each stage.",
    bullets: [
      "Advisory support for mergers, acquisitions, and business combinations",
      "Preliminary transaction review from tax and financial reporting perspectives",
      "Coordination with management and other advisors during execution",
      "Support on restructuring choices connected to ownership or control changes"
    ],
    suitableFor: ["Promoter groups", "Businesses evaluating acquisition opportunities", "Companies undergoing ownership transition"]
  },
  {
    slug: "international-tax",
    title: "International Tax",
    description:
      "Advisory on international tax questions involving cross-border income, transactions, documentation, and reporting obligations.",
    icon: Globe2,
    intro:
      "International tax matters need careful attention to fact patterns, treaty context, reporting obligations, and defensible records. Our role is to help clients navigate that complexity in a practical way.",
    bullets: [
      "Advisory on cross-border tax positions and reporting implications",
      "Review of international transaction structures and documentation needs",
      "Support on withholding, classification, and related interpretive issues",
      "Coordination assistance where tax questions intersect with broader compliance"
    ],
    suitableFor: ["Companies with foreign transactions", "NRI-related matters", "Businesses interacting with overseas counterparties"]
  },
  {
    slug: "corporate-services",
    title: "Corporate Services",
    description:
      "Corporate law and secretarial support tied to registrations, filings, governance requirements, and regulatory upkeep.",
    icon: FileSearch,
    intro:
      "Corporate housekeeping is essential to business continuity and lender, investor, or board confidence. We help keep statutory records and filings aligned with business activity.",
    bullets: [
      "Entity incorporation and foundational registration support",
      "ROC and related corporate filing assistance",
      "Secretarial and governance-related compliance coordination",
      "Support on changes in entity details, records, and corporate documentation"
    ],
    suitableFor: ["New and existing companies", "LLPs and business entities", "Clients needing recurring corporate compliance support"]
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
