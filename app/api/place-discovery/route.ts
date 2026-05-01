import { NextRequest, NextResponse } from "next/server";
import { places } from "@/data/places";

export const dynamic = "force-dynamic";

function normalize(value: string) {
  return value.toLowerCase().trim();
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

  return NextResponse.json({
    ok: true,
    mode: "static-fallback",
    provider: "landly-curated-data",
    notice: "TourAPI/live place discovery is not enabled in v47. This endpoint returns curated static data with trust labels so the UI can be wired before API keys are configured.",
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
