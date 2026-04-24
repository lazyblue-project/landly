import {
  ArrivalPlanInput,
  CalendarEvent,
  PassOption,
  PassPlan,
  StayDuration,
  TransitOption,
  TransitType,
  VisitPurpose,
} from "@/types";
import { airportDestinationPairs, airportOptions, knownLocations } from "@/data/pass-data";

const todayString = () => new Date().toISOString().slice(0, 10);
const appName = "https://landly.app";

type LocationPoint = { lat: number; lng: number };

export function buildDefaultArrivalInput(args: {
  city: string;
  stayDuration: StayDuration;
  visitPurpose: VisitPurpose;
}): ArrivalPlanInput {
  const intercityPlan = args.visitPurpose === "tourism" && args.stayDuration !== "under_1week";

  return {
    airport: args.city === "Busan" ? "PUS" : args.city === "Jeju" ? "CJU" : "ICN",
    arrivalDate: todayString(),
    arrivalTimeBand: "afternoon",
    destinationArea:
      args.city === "Busan"
        ? "Busan station area"
        : args.city === "Jeju"
          ? "Jeju city"
          : "Seoul central",
    groupSize: 1,
    hasLuggage: true,
    lateNight: false,
    intercityPlan,
    cityCount: intercityPlan ? 2 : 1,
    transitIntensity: args.visitPurpose === "tourism" ? "heavy" : "moderate",
  };
}

export function getAirportLabel(airport: string) {
  return airportOptions.find((option) => option.value === airport)?.label ?? airport;
}

export function getRecommendedDestinationPairs(airport: string) {
  return airportDestinationPairs[airport] ?? [];
}

function normalizeLookup(name: string) {
  return name.trim().toLowerCase();
}

function findKnownLocation(name: string): LocationPoint | null {
  const exact = Object.entries(knownLocations).find(
    ([label]) => normalizeLookup(label) === normalizeLookup(name)
  );

  if (exact) return exact[1];

  const partial = Object.entries(knownLocations).find(([label]) =>
    normalizeLookup(name).includes(normalizeLookup(label)) || normalizeLookup(label).includes(normalizeLookup(name))
  );

  return partial ? partial[1] : null;
}

function toGoogleTravelMode(type: TransitType) {
  return type === "taxi" ? "driving" : "transit";
}

export function buildGoogleMapsDirectionsUrl(args: {
  origin: string;
  destination: string;
  transportType: TransitType;
}) {
  const params = new URLSearchParams({
    api: "1",
    origin: args.origin,
    destination: args.destination,
    travelmode: toGoogleTravelMode(args.transportType),
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildNaverMapUrl(args: {
  origin: string;
  destination: string;
  transportType: TransitType;
}) {
  const originPoint = findKnownLocation(args.origin);
  const destinationPoint = findKnownLocation(args.destination);

  if (!originPoint || !destinationPoint) {
    const query = encodeURIComponent(`${args.origin} ${args.destination}`);
    return `nmap://search?query=${query}&appname=${encodeURIComponent(appName)}`;
  }

  const base = args.transportType === "taxi" ? "route/car" : "route/public";
  const params = new URLSearchParams({
    slat: String(originPoint.lat),
    slng: String(originPoint.lng),
    sname: args.origin,
    dlat: String(destinationPoint.lat),
    dlng: String(destinationPoint.lng),
    dname: args.destination,
    appname: appName,
  });

  return `nmap://${base}?${params.toString()}`;
}

function buildTransitSummary(type: TransitOption["type"], input: ArrivalPlanInput): string {
  switch (type) {
    case "airport-rail":
      return input.destinationArea.toLowerCase().includes("seoul")
        ? "Fast and budget-friendly for central Seoul arrivals."
        : "Best when you can handle one rail-based transfer without too much luggage.";
    case "limousine-bus":
      return "Balanced option when you want fewer transfers and direct neighborhood drop-offs.";
    case "taxi":
      return input.lateNight
        ? "Most reliable choice for late arrivals or when transit options are limited."
        : "Comfort-first option when you have luggage or want a simple door-to-door ride.";
    default:
      return "Mixed route combining rail and short taxi or bus transfer.";
  }
}

export function buildTransitOptions(input: ArrivalPlanInput): TransitOption[] {
  const scores = {
    rail: 0,
    bus: 0,
    taxi: 0,
    mixed: 0,
  };

  const isSeoulCentral = /seoul|myeongdong|jongno|hongdae|gangnam/i.test(input.destinationArea);

  if (isSeoulCentral) scores.rail += 3;
  if (!input.lateNight) scores.rail += 2;
  if (!input.hasLuggage) scores.rail += 1;
  if (input.transitIntensity === "heavy") scores.rail += 1;

  if (input.hasLuggage) scores.bus += 2;
  if (!input.lateNight) scores.bus += 2;
  if (!isSeoulCentral) scores.bus += 2;
  if (input.groupSize >= 2) scores.bus += 1;

  if (input.lateNight) scores.taxi += 4;
  if (input.groupSize >= 2) scores.taxi += 2;
  if (input.hasLuggage) scores.taxi += 2;
  if (!isSeoulCentral) scores.taxi += 1;

  if (!input.lateNight && input.intercityPlan) scores.mixed += 3;
  if (!isSeoulCentral) scores.mixed += 2;
  if (input.groupSize === 1) scores.mixed += 1;

  const options: Array<TransitOption & { score: number }> = [
    {
      id: "transit_airport_rail",
      type: "airport-rail",
      title: "Airport rail first",
      summary: buildTransitSummary("airport-rail", input),
      costLevel: "low",
      timeLevel: "fast",
      luggageFriendly: !input.hasLuggage ? true : input.groupSize === 1,
      nightFriendly: false,
      reasons: [
        isSeoulCentral ? "Strong fit for Seoul central hotels" : "Works well if you do not mind one transfer",
        input.transitIntensity === "heavy" ? "Good value if you will use transit often" : "Cheapest option in most daytime cases",
      ],
      ctaLabel: "Open route",
      ctaTarget: "https://www.google.com/maps",
      score: scores.rail,
    },
    {
      id: "transit_limousine_bus",
      type: "limousine-bus",
      title: "Airport limousine bus",
      summary: buildTransitSummary("limousine-bus", input),
      costLevel: "medium",
      timeLevel: "medium",
      luggageFriendly: true,
      nightFriendly: false,
      reasons: [
        "Comfortable when you carry large luggage",
        "Helpful when your hotel area has a direct bus stop",
      ],
      ctaLabel: "Open route",
      ctaTarget: "https://www.google.com/maps",
      score: scores.bus,
    },
    {
      id: "transit_taxi",
      type: "taxi",
      title: "Taxi direct",
      summary: buildTransitSummary("taxi", input),
      costLevel: "high",
      timeLevel: "fast",
      luggageFriendly: true,
      nightFriendly: true,
      reasons: [
        input.lateNight ? "Best fallback for late-night arrival" : "Great for door-to-door convenience",
        input.groupSize >= 2 ? "Cost can be reasonable when split with your group" : "Reduces transfer stress after a long flight",
      ],
      ctaLabel: "Open taxi",
      ctaTarget: "https://kride.kakaomobility.com/",
      score: scores.taxi,
    },
    {
      id: "transit_mixed",
      type: "mixed",
      title: "Rail + short taxi",
      summary: buildTransitSummary("mixed", input),
      costLevel: "medium",
      timeLevel: "medium",
      luggageFriendly: input.groupSize <= 2,
      nightFriendly: false,
      reasons: [
        "Balanced when you want to lower cost but avoid the hardest last-mile segment",
        input.intercityPlan ? "Useful if you continue from a main station later" : "Good backup option when direct routes are confusing",
      ],
      ctaLabel: "Open route",
      ctaTarget: "https://www.google.com/maps",
      score: scores.mixed,
    },
  ];

  return options.sort((a, b) => b.score - a.score).map(({ score, ...option }) => option).slice(0, 3);
}

export function buildPassRecommendation(input: ArrivalPlanInput): PassOption {
  if (input.intercityPlan || input.cityCount >= 2) {
    return {
      id: "pass_korail",
      type: "korail-pass",
      title: "Look at intercity rail passes",
      summary: "Best when your trip includes Seoul plus another city and you expect at least one KTX ride.",
      suitableFor: ["2+ cities", "KTX travelers", "week-long trips"],
      reasons: [
        "Your itinerary already includes intercity movement",
        "Rail planning matters more than unlimited city transit in this case",
      ],
      cautionNotes: [
        "Check seat availability before buying",
        "You may still need a local card for subway and bus rides",
      ],
      ctaLabel: "Open rail booking",
      ctaTarget: "https://www.letskorail.com/",
    };
  }

  if (input.transitIntensity === "heavy" && input.cityCount === 1) {
    return {
      id: "pass_climate_card",
      type: "climate-card",
      title: "Climate Card tourist pass",
      summary: "Best fit for a Seoul-focused trip with frequent subway and bus rides.",
      suitableFor: ["Seoul-only trips", "Daily transit users", "3–5 day tourism"],
      reasons: [
        "You expect lots of city transit usage",
        "Unlimited-style value is strongest when you stay mainly in Seoul",
      ],
      cautionNotes: [
        "Coverage rules can vary, so confirm current included routes",
        "May not help much if you rely mainly on taxis",
      ],
      ctaLabel: "Open transit guide",
      ctaTarget: "https://english.seoul.go.kr/service/movement/transportation/1-transportation-card/",
    };
  }

  if (input.transitIntensity === "light") {
    return {
      id: "pass_single_ride",
      type: "single-ride",
      title: "Pay as you go",
      summary: "Keep it simple if your transit needs are limited and mostly tied to airport or one-off rides.",
      suitableFor: ["Low transit usage", "Taxi-heavy stays", "Short layovers"],
      reasons: [
        "A pass is unlikely to beat pay-as-you-go value",
        "You can stay flexible without overbuying",
      ],
      cautionNotes: ["You may still want a transport card for convenience"],
      ctaLabel: "Open help guide",
      ctaTarget: "https://english.visitkorea.or.kr/",
    };
  }

  return {
    id: "pass_tmoney",
    type: "tmoney",
    title: "Start with a rechargeable transport card",
    summary: "A flexible default for mixed travel patterns, especially when your stay is longer or less predictable.",
    suitableFor: ["Flexible trips", "Longer stays", "Mixed subway and bus use"],
    reasons: [
      "Easy to use across most daily transit situations",
      "Works well while you decide whether a bigger pass is worth it",
    ],
    cautionNotes: ["Top-up and refund policies vary by seller"],
    ctaLabel: "Open transit guide",
    ctaTarget: "https://english.seoul.go.kr/service/movement/transportation/1-transportation-card/",
  };
}

export function buildTransitMapLinks(input: ArrivalPlanInput, option: TransitOption) {
  const origin = getAirportLabel(input.airport);
  const destination = input.destinationArea;

  return {
    googleMapsUrl: buildGoogleMapsDirectionsUrl({
      origin,
      destination,
      transportType: option.type,
    }),
    naverMapUrl: buildNaverMapUrl({
      origin,
      destination,
      transportType: option.type,
    }),
  };
}

export function buildPassPlan(input: ArrivalPlanInput, selectedTransitOptionId?: string): PassPlan {
  const transitOptions = buildTransitOptions(input);
  const recommendedPass = buildPassRecommendation(input);
  const selectedOption = transitOptions.find((option) => option.id === selectedTransitOptionId) ?? transitOptions[0] ?? null;
  const id = [input.airport, input.destinationArea, input.arrivalTimeBand, selectedOption?.id ?? recommendedPass.id]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  return {
    id,
    name: `${input.airport} → ${input.destinationArea}`,
    summary: `${selectedOption?.title ?? "Arrival plan"} + ${recommendedPass.title}`,
    input,
    transitOptions,
    recommendedPass,
    selectedTransitOptionId: selectedOption?.id,
    savedAt: new Date().toISOString(),
  };
}

export function buildCalendarEventFromPassPlan(plan: PassPlan): CalendarEvent {
  const selectedOption = plan.transitOptions.find((option) => option.id === plan.selectedTransitOptionId) ?? plan.transitOptions[0];
  const mapLinks = selectedOption ? buildTransitMapLinks(plan.input, selectedOption) : { googleMapsUrl: undefined, naverMapUrl: undefined };

  return {
    id: `calendar_${plan.id}`,
    title: `${plan.input.airport} arrival route`,
    date: plan.input.arrivalDate,
    category: "arrival",
    location: `${getAirportLabel(plan.input.airport)} → ${plan.input.destinationArea}`,
    note: selectedOption ? `${selectedOption.title} saved from Best arrival routes.` : undefined,
    sourceHref: "/pass?tab=saved",
    googleMapsUrl: mapLinks.googleMapsUrl,
    naverMapUrl: mapLinks.naverMapUrl,
    transportType: selectedOption?.type,
  };
}

export function buildManualRouteCalendarEvent(args: {
  date: string;
  origin: string;
  destination: string;
  transportType: TransitType;
}): CalendarEvent {
  return {
    id: `route_${Date.now()}`,
    title: `${args.origin} → ${args.destination}`,
    date: args.date,
    category: "route",
    location: args.destination,
    note: `${args.transportType === "taxi" ? "Taxi / driving" : "Transit"} route saved from Landly Pass.`,
    googleMapsUrl: buildGoogleMapsDirectionsUrl({
      origin: args.origin,
      destination: args.destination,
      transportType: args.transportType,
    }),
    naverMapUrl: buildNaverMapUrl({
      origin: args.origin,
      destination: args.destination,
      transportType: args.transportType,
    }),
    transportType: args.transportType,
  };
}
