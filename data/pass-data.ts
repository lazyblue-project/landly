import { QuickLauncher } from "@/types";

export const airportOptions = [
  { value: "ICN", label: "Incheon International Airport" },
  { value: "GMP", label: "Gimpo Airport" },
  { value: "PUS", label: "Gimhae Airport" },
  { value: "CJU", label: "Jeju Airport" },
];

export const destinationAreas = [
  "Seoul central",
  "Myeongdong / Jongno",
  "Hongdae / Mapo",
  "Gangnam / COEX",
  "Busan station area",
  "Haeundae",
  "Jeju city",
  "Incheon Songdo",
  "Suwon station area",
];

export const airportDestinationPairs: Record<string, string[]> = {
  ICN: ["Seoul central", "Myeongdong / Jongno", "Hongdae / Mapo", "Gangnam / COEX", "Incheon Songdo"],
  GMP: ["Hongdae / Mapo", "Seoul central", "Gangnam / COEX"],
  PUS: ["Busan station area", "Haeundae"],
  CJU: ["Jeju city"],
};

export const knownLocations = {
  "Incheon International Airport": { lat: 37.4602, lng: 126.4407 },
  "Gimpo Airport": { lat: 37.5583, lng: 126.7906 },
  "Gimhae Airport": { lat: 35.1795, lng: 128.9382 },
  "Jeju Airport": { lat: 33.5104, lng: 126.4913 },
  "Seoul central": { lat: 37.5547, lng: 126.9706 },
  "Myeongdong / Jongno": { lat: 37.5636, lng: 126.9826 },
  "Hongdae / Mapo": { lat: 37.5567, lng: 126.9245 },
  "Gangnam / COEX": { lat: 37.5118, lng: 127.0591 },
  "Busan station area": { lat: 35.1152, lng: 129.0414 },
  Haeundae: { lat: 35.1632, lng: 129.1636 },
  "Jeju city": { lat: 33.4996, lng: 126.5312 },
  "Incheon Songdo": { lat: 37.3887, lng: 126.6430 },
  "Suwon station area": { lat: 37.2663, lng: 126.9998 },
} as const;

export const launcherItems: QuickLauncher[] = [
  {
    id: "launcher_001",
    title: "Plan route to save",
    description: "Enter your date, origin, and destination, then save that route to Calendar.",
    type: "map",
    href: "/pass?tab=arrival",
  },
  {
    id: "launcher_002",
    title: "Open taxi app",
    description: "Move to a taxi booking flow after you decide the route.",
    type: "taxi",
    href: "https://kride.kakaomobility.com/",
  },
  {
    id: "launcher_003",
    title: "Open rail booking",
    description: "Use this when you plan intercity travel after arrival.",
    type: "rail",
    href: "https://www.letskorail.com/",
  },
  {
    id: "launcher_004",
    title: "Open tourist help",
    description: "Get official support when your travel plan changes or you need help.",
    type: "help",
    href: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140632",
  },
  {
    id: "launcher_005",
    title: "Open transit guide",
    description: "Check Seoul transit cards and travel cards before purchase.",
    type: "transit",
    href: "https://english.seoul.go.kr/service/movement/transportation/1-transportation-card/",
  },
];
