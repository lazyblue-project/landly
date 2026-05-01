import { NextRequest, NextResponse } from "next/server";
import { getGeneratedMapLinks } from "@/lib/map-handoff";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing query. Pass ?query=place%20name%20address.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "handoff-links-only",
    query,
    links: getGeneratedMapLinks(query),
    staticPreview: {
      enabled: false,
      reason: "Static map images require provider keys and coordinates. v47 keeps this route safe with generated map handoff links.",
      nextStep: "Add server-side Kakao/Naver map key handling and coordinate geocoding after API terms and quotas are confirmed.",
    },
  });
}
