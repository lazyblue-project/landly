import { PhraseCategory } from "@/types";

export type AssistantSituationTone = "blue" | "emerald" | "amber" | "rose" | "violet" | "gray";

export interface AssistantSituation {
  id: string;
  title: string;
  description: string;
  category: PhraseCategory;
  href: string;
  tone: AssistantSituationTone;
  priority: number;
  phraseIds: string[];
}

export const assistantSituations: AssistantSituation[] = [
  {
    id: "translation-help",
    title: "Get help when Korean is hard",
    description: "Ask staff to speak slowly, write it down, or use a translator app.",
    category: "settlement",
    href: "/assistant?category=settlement",
    tone: "blue",
    priority: 1,
    phraseIds: ["phrase_042", "phrase_043", "phrase_044", "phrase_045"],
  },
  {
    id: "taxi-address",
    title: "Show a taxi driver your destination",
    description: "Large Korean phrases for address, payment, and route confusion.",
    category: "taxi",
    href: "/assistant?category=taxi",
    tone: "blue",
    priority: 2,
    phraseIds: ["phrase_001", "phrase_027", "phrase_028", "phrase_048"],
  },
  {
    id: "pharmacy-symptoms",
    title: "Explain symptoms at a pharmacy",
    description: "Say what hurts, ask for safe medicine, and mention allergies.",
    category: "hospital",
    href: "/assistant?category=hospital",
    tone: "emerald",
    priority: 3,
    phraseIds: ["phrase_010", "phrase_030", "phrase_031", "phrase_018", "phrase_049"],
  },
  {
    id: "tax-refund-checkout",
    title: "Ask for tax refund at checkout",
    description: "Useful phrases for passport, receipt, and refund counters.",
    category: "shopping",
    href: "/assistant?category=shopping",
    tone: "violet",
    priority: 4,
    phraseIds: ["phrase_014", "phrase_015", "phrase_016", "phrase_032", "phrase_046"],
  },
  {
    id: "lost-passport-item",
    title: "Report a lost passport or item",
    description: "Explain what you lost and ask where to file a report.",
    category: "lost_complaint",
    href: "/assistant?category=lost_complaint",
    tone: "amber",
    priority: 5,
    phraseIds: ["phrase_012", "phrase_033", "phrase_034", "phrase_035"],
  },
  {
    id: "emergency-help",
    title: "Get emergency help fast",
    description: "Show urgent Korean phrases and call 119 or 112 quickly.",
    category: "emergency",
    href: "/assistant?category=emergency",
    tone: "rose",
    priority: 6,
    phraseIds: ["phrase_013", "phrase_036", "phrase_037", "phrase_038", "phrase_050"],
  },
  {
    id: "government-desk",
    title: "Ask for help at an office",
    description: "Use this for immigration, banking, housing, and school paperwork.",
    category: "settlement",
    href: "/assistant?category=settlement",
    tone: "gray",
    priority: 7,
    phraseIds: ["phrase_024", "phrase_025", "phrase_026", "phrase_039"],
  },
];
