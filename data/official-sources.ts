import type { TrustMetadata } from "@/types";

export type OfficialSourceCategory = "tourism" | "emergency" | "medical" | "immigration" | "refund";

export interface OfficialSourceCard {
  id: string;
  category: OfficialSourceCategory;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  callHref?: string;
  metadata: TrustMetadata;
  priority: number;
}

export const officialSources: OfficialSourceCard[] = [
  {
    id: "official_119",
    category: "emergency",
    title: "Emergency rescue / ambulance",
    description: "Use 119 first for medical emergency, fire, rescue, or immediate danger.",
    primaryHref: "https://english.visitseoul.net/medical-emergencies",
    primaryLabel: "Open medical emergency guide",
    callHref: "tel:119",
    metadata: {
      trustLevel: "official",
      sourceLabel: "Visit Seoul Medical Emergencies",
      sourceUrl: "https://english.visitseoul.net/medical-emergencies",
      lastCheckedAt: "2026-04-29",
      needsConfirmation: true,
    },
    priority: 1,
  },
  {
    id: "official_1330",
    category: "tourism",
    title: "Tourist information / interpretation",
    description: "Use 1330 for multilingual tourist information, travel help, and interpretation support.",
    primaryHref: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140632",
    primaryLabel: "Open 1330 guide",
    callHref: "tel:1330",
    metadata: {
      trustLevel: "official",
      sourceLabel: "VISITKOREA 1330 Travel Helpline",
      sourceUrl: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140632",
      lastCheckedAt: "2026-04-29",
      needsConfirmation: true,
    },
    priority: 2,
  },
  {
    id: "official_refund",
    category: "refund",
    title: "Tax refund rules",
    description: "Check purchase amount, unused item status, stay length, passport, and departure timing before checkout.",
    primaryHref: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140736",
    primaryLabel: "Open tax refund rules",
    metadata: {
      trustLevel: "official",
      sourceLabel: "VISITKOREA Duty Free & Tax Refunds",
      sourceUrl: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140736",
      lastCheckedAt: "2026-04-29",
      needsConfirmation: true,
    },
    priority: 3,
  },
  {
    id: "official_1345",
    category: "immigration",
    title: "Immigration and foreign resident help",
    description: "Use 1345 for visa, residence, ARC, and immigration-office preparation questions.",
    primaryHref: "https://www.immigration.go.kr/immigration_eng/1862/subview.do",
    primaryLabel: "Open 1345 contact center",
    callHref: "tel:1345",
    metadata: {
      trustLevel: "official",
      sourceLabel: "Immigration Contact Center 1345",
      sourceUrl: "https://www.immigration.go.kr/immigration_eng/1862/subview.do",
      lastCheckedAt: "2026-04-29",
      needsConfirmation: true,
    },
    priority: 4,
  },
  {
    id: "official_medical_korea",
    category: "medical",
    title: "Foreign patient support",
    description: "Use official medical support channels for interpretation, care navigation, and hospital guidance.",
    primaryHref: "https://www.medicalkorea.or.kr/en/",
    primaryLabel: "Open Medical Korea",
    metadata: {
      trustLevel: "official",
      sourceLabel: "Medical Korea",
      sourceUrl: "https://www.medicalkorea.or.kr/en/",
      lastCheckedAt: "2026-04-29",
      needsConfirmation: true,
    },
    priority: 5,
  },
];
