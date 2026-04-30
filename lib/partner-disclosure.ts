import type { PartnerOffer, PartnerRevenueModel, TrustBadge } from "@/types";

export type PartnerDisclosureSeverity = "low" | "medium" | "high";

interface RevenueModelCopy {
  label: string;
  plainMeaning: string;
  userImpact: string;
  severity: PartnerDisclosureSeverity;
}

const revenueModelCopy: Record<PartnerRevenueModel, RevenueModelCopy> = {
  affiliate: {
    label: "Affiliate link",
    plainMeaning: "Landly may earn if you use this path or offer.",
    userImpact: "Check price and terms on the partner page before paying.",
    severity: "medium",
  },
  referral: {
    label: "Referral lead",
    plainMeaning: "Landly may receive value if your inquiry becomes a partner lead.",
    userImpact: "Do not share sensitive details until you confirm the provider and purpose.",
    severity: "high",
  },
  commission: {
    label: "Commission model",
    plainMeaning: "Landly may earn a commission if a booking or setup is completed.",
    userImpact: "Compare the official price and cancellation terms before booking.",
    severity: "medium",
  },
  sponsored: {
    label: "Sponsored placement",
    plainMeaning: "This placement may be paid or promoted by a partner.",
    userImpact: "Treat it as promoted content, not a neutral ranking.",
    severity: "high",
  },
  pilot: {
    label: "Pilot / demo lane",
    plainMeaning: "This is a test flow and may not involve a live paid partner yet.",
    userImpact: "Use it to understand the next step, then confirm live availability.",
    severity: "low",
  },
};

export const partnerDisclosurePrinciples = [
  {
    id: "clear_label",
    title: "Commercial labels stay visible",
    description: "Every offer should show whether it is affiliate, referral, commission, sponsored, or pilot before the user sends interest.",
  },
  {
    id: "no_hidden_ranking",
    title: "No hidden paid ranking",
    description: "Paid or pilot status should not look like an official recommendation unless the card clearly says so.",
  },
  {
    id: "confirm_before_payment",
    title: "Confirm before payment or booking",
    description: "Users should verify price, refund, cancellation, provider, and official terms outside Landly before they pay.",
  },
  {
    id: "care_safety",
    title: "No paid medical priority",
    description: "Care offers must stay non-diagnostic and should never imply emergency, medical, or provider ranking guarantees.",
  },
];

export function getRevenueModelCopy(model: PartnerRevenueModel) {
  return revenueModelCopy[model];
}

export function getPartnerDisclosureSeverity(offer: PartnerOffer): PartnerDisclosureSeverity {
  if (offer.commercialDisclosure?.severity) return offer.commercialDisclosure.severity;
  if (offer.category === "care" && offer.revenueModel !== "pilot") return "high";
  return revenueModelCopy[offer.revenueModel].severity;
}

export function getPartnerDisclosureBadges(offer: PartnerOffer): TrustBadge[] {
  const copy = getRevenueModelCopy(offer.revenueModel);
  const severity = getPartnerDisclosureSeverity(offer);
  const severityTone: Record<PartnerDisclosureSeverity, TrustBadge["tone"]> = {
    low: "gray",
    medium: "violet",
    high: "amber",
  };

  return [
    { id: offer.id + "_revenue_model", label: copy.label, tone: offer.revenueModel === "pilot" ? "gray" : "violet" },
    { id: offer.id + "_disclosure_level", label: severity === "high" ? "Extra caution" : severity === "medium" ? "Commercial caution" : "Pilot caution", tone: severityTone[severity] },
  ];
}

export function getPartnerDisclosureChecklist(offer: PartnerOffer) {
  const shared = [
    "I understand this may be a commercial or pilot flow.",
    "I will confirm price, terms, availability, and provider details before paying.",
  ];

  if (offer.category === "care") {
    return [
      ...shared,
      "I understand Landly is not diagnosing symptoms or ranking medical providers.",
      "I will use emergency numbers first if symptoms are urgent.",
    ];
  }

  if (offer.category === "shopping") {
    return [
      ...shared,
      "I will confirm coupon and tax-refund rules at the store or official source.",
    ];
  }

  if (offer.category === "stay") {
    return [
      ...shared,
      "I will confirm visa, banking, housing, or immigration details with official sources.",
    ];
  }

  return shared;
}

export function isCommercialPartnerOffer(offer: PartnerOffer) {
  return offer.revenueModel !== "pilot";
}
