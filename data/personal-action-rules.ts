import { BellRing, CalendarDays, FileClock, HeartPulse, Languages, PlaneLanding, Receipt, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppMode, OnboardingNeed, StayDuration, VisitPurpose } from "@/types";

export type SmartActionTone = "sky" | "emerald" | "amber" | "rose" | "violet" | "slate";
export type SmartActionCategory = "arrival" | "shopping" | "care" | "stay" | "language" | "trust" | "reminder" | "calendar";

export interface SmartActionRule {
  id: string;
  title: string;
  description: string;
  href: string;
  category: SmartActionCategory;
  tone: SmartActionTone;
  icon: LucideIcon;
  baseScore: number;
  recommendedModes: AppMode[];
  firstNeeds?: OnboardingNeed[];
  visitPurposes?: VisitPurpose[];
  stayDurations?: StayDuration[];
  badge: string;
}

export const smartActionRules: SmartActionRule[] = [
  {
    id: "arrival_assistant",
    title: "Confirm your arrival route",
    description: "Compare airport rail, bus, taxi, map apps, and first-72-hour tasks before you move.",
    href: "/pass?tab=arrival",
    category: "arrival",
    tone: "sky",
    icon: PlaneLanding,
    baseScore: 72,
    recommendedModes: ["travel"],
    firstNeeds: ["airport_transport"],
    stayDurations: ["under_1week", "1_4weeks", "1_3months"],
    badge: "Arrival priority",
  },
  {
    id: "refund_wallet",
    title: "Review your refund wallet",
    description: "Check pending receipts, passport readiness, and airport refund steps before departure.",
    href: "/shop/receipts",
    category: "shopping",
    tone: "emerald",
    icon: Receipt,
    baseScore: 64,
    recommendedModes: ["travel", "life"],
    firstNeeds: ["shopping_refund"],
    visitPurposes: ["tourism", "business"],
    badge: "Refund ready",
  },
  {
    id: "shopping_checker",
    title: "Check refund eligibility before checkout",
    description: "Use amount, item type, stay length, and departure timing to avoid missing tax refund steps.",
    href: "/shop/checker",
    category: "shopping",
    tone: "emerald",
    icon: ShoppingBag,
    baseScore: 54,
    recommendedModes: ["travel"],
    firstNeeds: ["shopping_refund"],
    badge: "Before checkout",
  },
  {
    id: "care_safety",
    title: "Prepare care or pharmacy help",
    description: "Open safety triage, nearby care options, and Korean show-to-staff phrases.",
    href: "/care?tab=overview",
    category: "care",
    tone: "rose",
    icon: HeartPulse,
    baseScore: 60,
    recommendedModes: ["travel", "life"],
    firstNeeds: ["hospital_pharmacy", "emergency_help"],
    badge: "Care ready",
  },
  {
    id: "settlement_plan",
    title: "Build your settlement plan",
    description: "Create a 90-day plan for registration, phone, banking, healthcare, housing, and documents.",
    href: "/stay?tab=plan",
    category: "stay",
    tone: "emerald",
    icon: FileClock,
    baseScore: 78,
    recommendedModes: ["life"],
    firstNeeds: ["long_stay_setup"],
    visitPurposes: ["study", "work", "residence"],
    stayDurations: ["over_3months"],
    badge: "Life setup",
  },
  {
    id: "document_vault",
    title: "Organize important documents",
    description: "Keep passport, residence, housing, insurance, school, or work documents in one review lane.",
    href: "/stay?tab=documents",
    category: "stay",
    tone: "violet",
    icon: CalendarDays,
    baseScore: 58,
    recommendedModes: ["life"],
    firstNeeds: ["long_stay_setup"],
    badge: "Document vault",
  },
  {
    id: "phrase_pack",
    title: "Save Korean phrases you may need today",
    description: "Prepare taxi, restaurant, shopping, hospital, emergency, and settlement phrases for quick showing.",
    href: "/assistant",
    category: "language",
    tone: "violet",
    icon: Languages,
    baseScore: 50,
    recommendedModes: ["travel", "life"],
    firstNeeds: ["korean_phrases"],
    badge: "Show-to-staff",
  },
  {
    id: "trust_center",
    title: "Check what needs official confirmation",
    description: "Review official-source, partner, demo, and needs-check labels before you move, pay, or visit.",
    href: "/trust",
    category: "trust",
    tone: "slate",
    icon: ShieldCheck,
    baseScore: 45,
    recommendedModes: ["travel", "life"],
    badge: "Trust check",
  },
  {
    id: "reminder_review",
    title: "Review reminders needing attention",
    description: "Open overdue and due-soon items from documents, arrival plans, refund steps, stay checkpoints, and calendar.",
    href: "/my",
    category: "reminder",
    tone: "amber",
    icon: BellRing,
    baseScore: 66,
    recommendedModes: ["travel", "life"],
    badge: "Due soon",
  },
  {
    id: "personal_command_center",
    title: "Keep decisions in My",
    description: "Saved routes, receipts, documents, care notes, phrases, promotions, and reminders are grouped in one place.",
    href: "/my",
    category: "calendar",
    tone: "sky",
    icon: Sparkles,
    baseScore: 42,
    recommendedModes: ["travel", "life"],
    badge: "Command center",
  },
];
