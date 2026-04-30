import type { Language, PhraseCategory } from "@/types";

export type LanguageReadinessTone = "blue" | "emerald" | "amber" | "rose" | "violet" | "gray";

export interface LanguageReadinessKit {
  id: string;
  title: string;
  description: string;
  category: PhraseCategory;
  href: string;
  tone: LanguageReadinessTone;
  priority: number;
  phraseIds: string[];
  whenToUse: string;
}

export const languageLabels: Record<Language, string> = {
  en: "English",
  ko: "Korean",
  zh: "Chinese",
  ja: "Japanese",
  es: "Spanish",
  fr: "French",
};

export const essentialLanguagePhraseIds = [
  "phrase_042",
  "phrase_043",
  "phrase_001",
  "phrase_014",
  "phrase_036",
  "phrase_049",
];

export const languageReadinessKits: LanguageReadinessKit[] = [
  {
    id: "translation-basics",
    title: "Translation basics",
    description: "Start with polite Korean lines for slow speaking, writing things down, and using a translator app.",
    category: "settlement",
    href: "/assistant?category=settlement",
    tone: "blue",
    priority: 1,
    phraseIds: ["phrase_042", "phrase_043", "phrase_044", "phrase_045"],
    whenToUse: "Use before any counter, hotel, clinic, store, or government office conversation.",
  },
  {
    id: "arrival-taxi",
    title: "Arrival taxi lines",
    description: "Keep address, navigation, payment, and stop-here phrases ready before you leave the airport.",
    category: "taxi",
    href: "/assistant?category=taxi",
    tone: "emerald",
    priority: 2,
    phraseIds: ["phrase_001", "phrase_027", "phrase_028", "phrase_048"],
    whenToUse: "Use when showing a driver your destination or checking card payment.",
  },
  {
    id: "refund-checkout",
    title: "Refund checkout lines",
    description: "Ask about tax refund, passport checks, receipts, and refund counters before leaving the store.",
    category: "shopping",
    href: "/assistant?category=shopping",
    tone: "violet",
    priority: 3,
    phraseIds: ["phrase_014", "phrase_015", "phrase_016", "phrase_032", "phrase_046"],
    whenToUse: "Use at checkout before paying or when organizing receipts for departure.",
  },
  {
    id: "clinic-pharmacy",
    title: "Clinic and pharmacy lines",
    description: "Explain symptoms, ask for English-speaking help, medicine instructions, and translation support.",
    category: "hospital",
    href: "/assistant?category=hospital",
    tone: "rose",
    priority: 4,
    phraseIds: ["phrase_010", "phrase_018", "phrase_030", "phrase_031", "phrase_049"],
    whenToUse: "Use at reception, pharmacy counters, or when showing symptoms to staff.",
  },
  {
    id: "emergency-show-card",
    title: "Emergency show-card",
    description: "Save urgent Korean lines for calling 119/112 and showing your current location.",
    category: "emergency",
    href: "/assistant?category=emergency",
    tone: "amber",
    priority: 5,
    phraseIds: ["phrase_013", "phrase_036", "phrase_037", "phrase_038", "phrase_050"],
    whenToUse: "Use only when you need urgent help, police, ambulance, or location support.",
  },
  {
    id: "hotel-luggage",
    title: "Hotel and luggage lines",
    description: "Prepare check-in, luggage storage, and simple accommodation requests.",
    category: "accommodation",
    href: "/assistant?category=accommodation",
    tone: "gray",
    priority: 6,
    phraseIds: ["phrase_004", "phrase_047"],
    whenToUse: "Use at hotel reception, guesthouses, lockers, or luggage counters.",
  },
];
