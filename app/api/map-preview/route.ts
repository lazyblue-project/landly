import { NextRequest, NextResponse } from "next/server";
import { getGeneratedMapLinks } from "@/lib/map-handoff";

export const dynamic = "force-dynamic";

function hasStaticMapKeys() {
  return Boolean(
    process.env.KAKAO_REST_API_KEY ||
      (process.env.NAVER_MAP_CLIENT_ID && process.env.NAVER_MAP_CLIENT_SECRET)
  );
}

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      {
        ok: false,
        version: "v48",
        error: "Missing query. Pass ?query=place%20name%20address.",
        fallbackAvailable: true,
      },
      { status: 400 }
    );
  }

  const staticMapKeysReady = hasStaticMapKeys();

  return NextResponse.json({
    ok: true,
    version: "v48",
    mode: staticMapKeysReady ? "provider-ready-shell" : "handoff-links-only",
    query,
    links: getGeneratedMapLinks(query),
    staticPreview: {
      enabled: false,
      providerKeysConfigured: staticMapKeysReady,
      reason: staticMapKeysReady
        ? "Provider keys appear configured, but v48 still keeps static map images disabled until geocoding, quota, and caching rules are finalized."
        : "Static map images require server-side provider keys and verified coordinates. v48 keeps this route safe with generated map handoff links.",
      fallback: "Use generated Naver/Kakao/Google map search links.",
      nextStep: "Add server-side geocoding, coordinate validation, cache headers, and provider-specific error handling before returning static map images.",
    },
  });
}
