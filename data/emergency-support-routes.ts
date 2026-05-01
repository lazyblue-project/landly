import type { TrustMetadata } from "@/types";

export type EmergencySupportTone = "red" | "blue" | "emerald" | "amber";

export interface EmergencySupportRoute extends TrustMetadata {
  id: "medical" | "police" | "tourist" | "immigration" | "medical-info";
  title: string;
  number: string;
  description: string;
  whenToUse: string;
  koreanScript: string;
  romanization: string;
  englishScript: string;
  tone: EmergencySupportTone;
  priority: number;
}

export const emergencySupportRoutes: EmergencySupportRoute[] = [
  {
    id: "medical",
    trustLevel: "official",
    sourceLabel: "Visit Seoul Medical Emergencies",
    sourceUrl: "https://english.visitseoul.net/medical-emergencies",
    lastCheckedAt: "2026-04-29",
    needsConfirmation: true,
    title: "Emergency ambulance / fire",
    number: "119",
    description: "Use for medical emergency, accident, or fire.",
    whenToUse: "Breathing trouble, heavy bleeding, chest pain, severe injury, fire, or immediate danger.",
    koreanScript: "응급상황입니다. 119에 전화해 주세요.",
    romanization: "Eung-geup sang-hwang-im-ni-da. Il-il-gu-e jeon-hwa-hae ju-se-yo.",
    englishScript: "This is an emergency. Please call 119.",
    tone: "red",
    priority: 1,
  },
  {
    id: "police",
    trustLevel: "official",
    sourceLabel: "Korea police emergency number",
    lastCheckedAt: "2026-04-29",
    needsConfirmation: true,
    title: "Police",
    number: "112",
    description: "Use for theft, assault, stalking, or immediate safety concerns.",
    whenToUse: "Crime, harassment, violence, lost passport after theft, or safety risk.",
    koreanScript: "경찰 도움이 필요합니다. 112에 전화해 주세요.",
    romanization: "Gyeong-chal do-um-i pil-yo-ham-ni-da. Il-il-i-e jeon-hwa-hae ju-se-yo.",
    englishScript: "I need police help. Please call 112.",
    tone: "blue",
    priority: 2,
  },
  {
    id: "tourist",
    trustLevel: "official",
    sourceLabel: "VISITKOREA 1330 Travel Helpline",
    sourceUrl: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140632",
    lastCheckedAt: "2026-04-29",
    needsConfirmation: true,
    title: "Tourist hotline",
    number: "1330",
    description: "Use for travel support, interpretation, or general help.",
    whenToUse: "Travel questions, interpretation help, lost items, directions, or non-emergency support.",
    koreanScript: "외국인 여행자입니다. 통역 도움이 필요합니다.",
    romanization: "Oe-guk-in yeo-haeng-ja-im-ni-da. Tong-yeok do-um-i pil-yo-ham-ni-da.",
    englishScript: "I am a foreign traveler. I need interpretation help.",
    tone: "emerald",
    priority: 3,
  },
  {
    id: "immigration",
    trustLevel: "official",
    sourceLabel: "Immigration Contact Center 1345",
    sourceUrl: "https://www.immigration.go.kr/immigration_eng/1862/subview.do",
    lastCheckedAt: "2026-04-29",
    needsConfirmation: true,
    title: "Immigration contact center",
    number: "1345",
    description: "Use for visa, ARC, immigration, and long-stay administration questions.",
    whenToUse: "Visa questions, alien registration, residence status, or immigration-office preparation.",
    koreanScript: "체류/비자 관련 상담이 필요합니다.",
    romanization: "Che-ryu / bi-ja gwan-ryeon sang-dam-i pil-yo-ham-ni-da.",
    englishScript: "I need help with visa or immigration questions.",
    tone: "amber",
    priority: 4,
  },
  {
    id: "medical-info",
    trustLevel: "needs-check",
    sourceLabel: "Confirm local medical guidance channel",
    lastCheckedAt: "2026-04-29",
    needsConfirmation: true,
    title: "Medical guidance hotline",
    number: "1339",
    description: "Use as a medical guidance option when available, especially before deciding where to go.",
    whenToUse: "Non-life-threatening medical questions, pharmacy/clinic decision support, or night-time uncertainty.",
    koreanScript: "의료 상담이 필요합니다. 어디로 가야 하는지 알고 싶습니다.",
    romanization: "Ui-ryo sang-dam-i pil-yo-ham-ni-da. Eo-di-ro ga-ya ha-neun-ji al-go sip-seum-ni-da.",
    englishScript: "I need medical guidance. I want to know where I should go.",
    tone: "amber",
    priority: 5,
  },
];
