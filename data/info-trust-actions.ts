export type InfoTrustActionCategory = "official" | "confirm" | "commercial" | "saved";

export interface InfoTrustAction {
  id: string;
  category: InfoTrustActionCategory;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  module: "Pass" | "Shop" | "Care" | "Stay" | "SOS" | "Partners";
  priority: number;
}

export const infoTrustActions: InfoTrustAction[] = [
  {
    id: "trust_arrival_routes",
    category: "confirm",
    title: "Confirm the route before you move",
    description: "Airport buses, taxis, and late-night options can change. Open your route and keep a backup phrase ready before leaving the airport.",
    primaryHref: "/pass?tab=arrival",
    primaryLabel: "Open arrival assistant",
    secondaryHref: "/assistant",
    secondaryLabel: "Open taxi phrases",
    module: "Pass",
    priority: 1,
  },
  {
    id: "trust_refund_rules",
    category: "official",
    title: "Check refund rules before checkout",
    description: "Tax refund eligibility depends on purchase amount, store setup, item category, passport checks, and departure timing.",
    primaryHref: "/shop/checker",
    primaryLabel: "Check refund eligibility",
    secondaryHref: "/shop/receipts",
    secondaryLabel: "Open Refund Wallet",
    module: "Shop",
    priority: 2,
  },
  {
    id: "trust_medical_red_flags",
    category: "official",
    title: "Treat medical red flags as urgent",
    description: "Landly can help organize symptoms and phrases, but breathing issues, heavy bleeding, chest pain, or severe symptoms should go to emergency help first.",
    primaryHref: "/care?tab=triage",
    primaryLabel: "Open safety triage",
    secondaryHref: "/sos",
    secondaryLabel: "Open SOS",
    module: "Care",
    priority: 3,
  },
  {
    id: "trust_immigration_deadlines",
    category: "official",
    title: "Use official immigration sources for deadlines",
    description: "Visa, ARC, address changes, and insurance steps can vary by status. Keep the official route visible next to your checklist.",
    primaryHref: "/stay?tab=plan",
    primaryLabel: "Open settlement plan",
    secondaryHref: "/life",
    secondaryLabel: "Open checklist",
    module: "Stay",
    priority: 4,
  },
  {
    id: "trust_partner_disclosure",
    category: "commercial",
    title: "Know when a card is commercial",
    description: "Partner lanes are useful for coupons, referrals, and booking pilots, but they should always show commercial model and confirmation status.",
    primaryHref: "/partners",
    primaryLabel: "Review partner offers",
    module: "Partners",
    priority: 5,
  },
  {
    id: "trust_saved_items",
    category: "saved",
    title: "Keep decisions and reminders in My",
    description: "Save routes, receipts, documents, care notes, and important dates so you can re-check the source before acting.",
    primaryHref: "/my",
    primaryLabel: "Open My command center",
    secondaryHref: "/calendar",
    secondaryLabel: "Open Calendar",
    module: "SOS",
    priority: 6,
  },
];
