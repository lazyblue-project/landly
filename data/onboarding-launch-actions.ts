import type { BetaMissionId, OnboardingNeed, PartnerOfferCategory, PromotionAudience, StayDuration, VisitPurpose } from "@/types";

export interface OnboardingLaunchAction {
  need: OnboardingNeed;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  betaMissionId: BetaMissionId;
  betaHref: string;
  betaLabel: string;
  partnerHref: string;
  partnerLabel: string;
  partnerCategory?: PartnerOfferCategory;
  partnerAudience?: PromotionAudience;
  safetyNote: string;
}

const launchActions: Record<OnboardingNeed, OnboardingLaunchAction> = {
  airport_transport: {
    need: "airport_transport",
    title: "Arrival route first",
    description: "Start with airport routes, map handoff, and the first 72-hour arrival checklist.",
    primaryHref: "/pass?tab=first72",
    primaryLabel: "Open arrival plan",
    betaMissionId: "arrival",
    betaHref: "/test?mission=arrival",
    betaLabel: "Run arrival test",
    partnerHref: "/partners?category=transport&audience=first_timer",
    partnerLabel: "Review transport partner lanes",
    partnerCategory: "transport",
    partnerAudience: "first_timer",
    safetyNote: "Confirm live pickup points, fares, and map routes before moving.",
  },
  shopping_refund: {
    need: "shopping_refund",
    title: "Refund wallet first",
    description: "Check refund eligibility, save receipts, and prepare passport/departure steps before checkout.",
    primaryHref: "/shop/checker",
    primaryLabel: "Open refund checker",
    betaMissionId: "shop",
    betaHref: "/test?mission=shop",
    betaLabel: "Run refund test",
    partnerHref: "/partners?category=shopping&audience=shopper",
    partnerLabel: "Review shopping partner lanes",
    partnerCategory: "shopping",
    partnerAudience: "shopper",
    safetyNote: "Confirm final tax-refund rules at the store or official source before paying.",
  },
  hospital_pharmacy: {
    need: "hospital_pharmacy",
    title: "Care triage first",
    description: "Separate urgent symptoms from ordinary clinic or pharmacy steps, then prepare a visit note.",
    primaryHref: "/care?tab=triage",
    primaryLabel: "Open care triage",
    betaMissionId: "care",
    betaHref: "/test?mission=care",
    betaLabel: "Run care test",
    partnerHref: "/partners?category=care&audience=wellness",
    partnerLabel: "Review care partner disclosure",
    partnerCategory: "care",
    partnerAudience: "wellness",
    safetyNote: "Use emergency numbers first for severe symptoms; partner lanes never replace medical judgment.",
  },
  korean_phrases: {
    need: "korean_phrases",
    title: "Language kit first",
    description: "Save essential show-to-staff phrases for taxis, stores, clinics, and emergency moments.",
    primaryHref: "/assistant",
    primaryLabel: "Open phrases",
    betaMissionId: "assistant",
    betaHref: "/test?mission=assistant",
    betaLabel: "Run phrase test",
    partnerHref: "/partners?audience=first_timer",
    partnerLabel: "Review first-timer partner lanes",
    partnerAudience: "first_timer",
    safetyNote: "Use translated phrases as communication support, then confirm important details with staff.",
  },
  long_stay_setup: {
    need: "long_stay_setup",
    title: "90-day setup first",
    description: "Start settlement tasks for registration, banking, phone, housing, documents, and deadlines.",
    primaryHref: "/stay?tab=first90",
    primaryLabel: "Open stay planner",
    betaMissionId: "stay",
    betaHref: "/test?mission=stay",
    betaLabel: "Run 90-day test",
    partnerHref: "/partners?category=stay&audience=resident",
    partnerLabel: "Review settlement partner lanes",
    partnerCategory: "stay",
    partnerAudience: "resident",
    safetyNote: "Confirm visa, housing, banking, and immigration details with official sources.",
  },
  emergency_help: {
    need: "emergency_help",
    title: "SOS clarity first",
    description: "Keep 112, 119, 1330, scenarios, and emergency Korean scripts within a few taps.",
    primaryHref: "/sos",
    primaryLabel: "Open SOS",
    betaMissionId: "sos",
    betaHref: "/test?mission=sos",
    betaLabel: "Run SOS test",
    partnerHref: "/trust",
    partnerLabel: "Review official-source rules",
    safetyNote: "Emergency flows should prioritize official numbers and scripts, not commercial offers.",
  },
};

function inferNeedFromProfile(purpose: VisitPurpose, duration: StayDuration, firstNeed?: OnboardingNeed): OnboardingNeed {
  if (firstNeed) return firstNeed;
  if (purpose === "study" || purpose === "work" || purpose === "residence" || duration === "over_3months") return "long_stay_setup";
  return "airport_transport";
}

export function getOnboardingLaunchAction(input: {
  purpose: VisitPurpose;
  duration: StayDuration;
  firstNeed?: OnboardingNeed;
}): OnboardingLaunchAction {
  return launchActions[inferNeedFromProfile(input.purpose, input.duration, input.firstNeed)];
}

export function getLaunchActionByNeed(need: OnboardingNeed) {
  return launchActions[need];
}
