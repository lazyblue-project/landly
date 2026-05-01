export type DataProviderPilotStatus = "ready-shell" | "needs-key" | "future" | "disabled";

export interface DataProviderPilot {
  id: string;
  name: string;
  scope: "map" | "place" | "care" | "notification";
  status: DataProviderPilotStatus;
  priority: number;
  envKeys: string[];
  currentFallback: string;
  nextStep: string;
  riskNote: string;
}

export const dataProviderPilots: DataProviderPilot[] = [
  {
    id: "map_handoff_links",
    name: "Map handoff links",
    scope: "map",
    status: "ready-shell",
    priority: 1,
    envKeys: [],
    currentFallback: "Generated Naver/Kakao/Google search links from place name and area.",
    nextStep: "Add provider-specific deep links and verified coordinates for high-traffic cards.",
    riskNote: "Search-result pins can differ by provider. Users must confirm the exact pin before moving.",
  },
  {
    id: "static_map_preview",
    name: "Static map preview",
    scope: "map",
    status: "needs-key",
    priority: 2,
    envKeys: ["KAKAO_REST_API_KEY", "NAVER_MAP_CLIENT_ID", "NAVER_MAP_CLIENT_SECRET"],
    currentFallback: "In-app map preview card with external map app buttons.",
    nextStep: "Enable server-side geocoding/static map route after API terms, quota, and domain settings are confirmed.",
    riskNote: "Never expose secret provider keys in client components.",
  },
  {
    id: "tourapi_place_discovery",
    name: "TourAPI place discovery",
    scope: "place",
    status: "needs-key",
    priority: 3,
    envKeys: ["TOURAPI_SERVICE_KEY"],
    currentFallback: "Curated static Explore data returned from /api/place-discovery.",
    nextStep: "Map TourAPI categories into Landly categories and cache results by city/category.",
    riskNote: "Tourist data still needs freshness labels and fallback UI when the API fails.",
  },
  {
    id: "seoul_care_data",
    name: "Seoul hospital/pharmacy data",
    scope: "care",
    status: "future",
    priority: 4,
    envKeys: ["SEOUL_OPEN_DATA_KEY"],
    currentFallback: "Curated Care cards with strong source-confirmation warnings.",
    nextStep: "Start with pharmacy/hospital directory discovery only; keep medical triage conservative.",
    riskNote: "Care data has high safety risk. Hours, languages, and availability need explicit confirmation.",
  },
  {
    id: "web_push_notifications",
    name: "Web Push notifications",
    scope: "notification",
    status: "future",
    priority: 5,
    envKeys: ["WEB_PUSH_VAPID_PUBLIC_KEY", "WEB_PUSH_VAPID_PRIVATE_KEY"],
    currentFallback: "Local reminder center and calendar-style checklist inside the app.",
    nextStep: "Add opt-in push only after a backend subscription store exists.",
    riskNote: "Push requires consent, backend storage, unsubscribe handling, and browser compatibility checks.",
  },
];
