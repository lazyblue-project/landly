import type { AppMode, OfflineKitItem } from "@/types";

export interface OfflinePrepStep {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  requiredFor: AppMode[];
  signal: "phrases" | "route" | "receipts" | "care" | "documents" | "departure" | "trust";
}

export const offlineKitItems: OfflineKitItem[] = [
  {
    id: "offline_emergency_numbers",
    title: "Emergency numbers card",
    description: "Keep 119, 112, 1330, 1345, and 1339 visible before you need them.",
    category: "emergency",
    href: "/sos",
    priority: 1,
    recommendedModes: ["travel", "life"],
    offlineValue: "Critical numbers and Korean show-card scripts stay easy to find even when search is slow.",
    checklist: ["Memorize 119 and 112", "Save the 1330 interpretation line", "Keep your current address ready"],
    phoneNumber: "119",
  },
  {
    id: "offline_language_show_cards",
    title: "Essential Korean show-cards",
    description: "Save taxi, refund, clinic, and emergency phrases that can be shown to staff.",
    category: "language",
    href: "/assistant",
    priority: 2,
    recommendedModes: ["travel", "life"],
    offlineValue: "Saved phrases reduce panic when mobile data, translation apps, or Wi-Fi are unreliable.",
    checklist: ["Save basic translation requests", "Save taxi address lines", "Save emergency location line"],
    phraseIds: ["ko-basic-slowly", "taxi-stop-here", "emergency-current-location"],
  },
  {
    id: "offline_arrival_route",
    title: "Arrival route backup",
    description: "Keep your airport route, taxi phrase, and first 72-hour steps one tap away.",
    category: "route",
    href: "/navigate",
    priority: 3,
    recommendedModes: ["travel", "life"],
    offlineValue: "A saved plan gives you a fallback if map loading fails after landing.",
    checklist: ["Save one route plan", "Prepare destination Korean text", "Know the late-night fallback"],
  },
  {
    id: "offline_refund_receipts",
    title: "Refund receipt backup",
    description: "Group receipts, passport-ready status, and departure reminders before leaving Korea.",
    category: "refund",
    href: "/shop/receipts",
    priority: 4,
    recommendedModes: ["travel"],
    offlineValue: "You can review what needs passport or airport counter checks without re-searching store rules.",
    checklist: ["Save receipts", "Mark passport-ready", "Check airport refund before departure"],
  },
  {
    id: "offline_care_visit_card",
    title: "Care visit card",
    description: "Prepare symptoms, medications, allergy notes, and interpreter requests for a clinic or pharmacy.",
    category: "care",
    href: "/care",
    priority: 5,
    recommendedModes: ["travel", "life"],
    offlineValue: "A prepared visit brief lets you explain your situation to staff even with limited Korean.",
    checklist: ["Write symptom start time", "Add allergy/medication notes", "Save interpreter request phrase"],
  },
  {
    id: "offline_stay_documents",
    title: "Long-stay document snapshot",
    description: "Keep passport, ARC, housing, insurance, and deadline notes organized for admin visits.",
    category: "stay",
    href: "/stay",
    priority: 6,
    recommendedModes: ["life"],
    offlineValue: "Document labels and expiry reminders help when government-office Wi-Fi or login flows are slow.",
    checklist: ["Save passport/ARC notes", "Add housing proof", "Set key deadlines in calendar"],
  },
];

export const offlinePrepSteps: OfflinePrepStep[] = [
  {
    id: "offline_step_phrases",
    title: "Save essential phrase kit",
    description: "Prepare show-cards for taxi, refund, clinic, hotel, and emergency situations.",
    href: "/assistant",
    ctaLabel: "Open language kit",
    requiredFor: ["travel", "life"],
    signal: "phrases",
  },
  {
    id: "offline_step_route",
    title: "Save one arrival or daily route",
    description: "Keep at least one route plan and destination phrase ready before moving.",
    href: "/navigate",
    ctaLabel: "Open map handoff",
    requiredFor: ["travel", "life"],
    signal: "route",
  },
  {
    id: "offline_step_departure",
    title: "Set departure date",
    description: "Use it for refund, airport, and final-day reminders.",
    href: "/shop/receipts",
    ctaLabel: "Open Refund Wallet",
    requiredFor: ["travel"],
    signal: "departure",
  },
  {
    id: "offline_step_care",
    title: "Prepare one care note",
    description: "Write symptoms, medications, allergies, and interpreter needs before a visit.",
    href: "/care",
    ctaLabel: "Prepare care visit",
    requiredFor: ["travel", "life"],
    signal: "care",
  },
  {
    id: "offline_step_documents",
    title: "Keep document labels ready",
    description: "Save passport, ARC, housing, insurance, or school/work document notes.",
    href: "/stay",
    ctaLabel: "Open stay documents",
    requiredFor: ["life"],
    signal: "documents",
  },
  {
    id: "offline_step_trust",
    title: "Check official-source routes",
    description: "Know which source to confirm before moving, paying, visiting, or submitting documents.",
    href: "/trust",
    ctaLabel: "Open trust center",
    requiredFor: ["travel", "life"],
    signal: "trust",
  },
];
