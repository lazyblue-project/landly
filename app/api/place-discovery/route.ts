import { NextRequest, NextResponse } from "next/server";
import { places } from "@/data/places";

export const dynamic = "force-dynamic";

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function isTourApiConfigured() {
  return Boolean(process.env.TOURAPI_SERVICE_KEY);
}

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = normalize(searchParams.get("q") ?? "");
  const city = normalize(searchParams.get("city") ?? "");
  const category = normalize(searchParams.get("category") ?? "");

  const filtered = places
    .filter((place) => !query || normalize([place.name, place.address, place.description, place.tags.join(" ")].join(" ")).includes(query))
    .filter((place) => !city || normalize(place.city).includes(city))
    .filter((place) => !category || normalize(place.category) === category)
    .slice(0, 12);

  const tourApiConfigured = isTourApiConfigured();

  return NextResponse.json({
    ok: true,
    version: "v48",
    mode: "static-fallback",
    provider: "landly-curated-data",
    fallbackUsed: true,
    providerReadiness: {
      tourApiConfigured,
      liveFetchEnabled: false,
      reason: tourApiConfigured
        ? "TOURAPI_SERVICE_KEY exists, but live fetching is intentionally disabled until category mapping, caching, and trust/freshness labels are finalized."
        : "TOURAPI_SERVICE_KEY is not configured.",
    },
    notice: "v48 returns curated static data with trust labels. This keeps the frontend contract stable before live provider calls are enabled.",
    query: { q: query, city, category },
    count: filtered.length,
    results: filtered.map((place) => ({
      id: place.id,
      name: place.name,
      category: place.category,
      city: place.city,
      address: place.address,
      trustLevel: place.trustLevel,
      lastCheckedAt: place.lastCheckedAt,
      needsConfirmation: place.needsConfirmation,
      tags: place.tags,
    })),
  });
}
