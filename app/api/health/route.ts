import { NextResponse } from "next/server";
import {
  LANDLY_CORE_ROUTES,
  LANDLY_RELEASE_DATE,
  LANDLY_RELEASE_NAME,
  LANDLY_RELEASE_SUMMARY,
  LANDLY_RELEASE_VERSION,
} from "@/lib/release-metadata";

function isConfigured(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "Landly",
      version: LANDLY_RELEASE_VERSION,
      releaseName: LANDLY_RELEASE_NAME,
      releaseDate: LANDLY_RELEASE_DATE,
      summary: LANDLY_RELEASE_SUMMARY,
      checkedAt: new Date().toISOString(),
      coreRoutes: {
        count: LANDLY_CORE_ROUTES.length,
        routes: LANDLY_CORE_ROUTES,
      },
      featureFlags: {
        betaTools: process.env.NEXT_PUBLIC_ENABLE_BETA_TOOLS === "true",
        partners: process.env.NEXT_PUBLIC_ENABLE_PARTNERS === "true",
        feedbackApi: process.env.NEXT_PUBLIC_ENABLE_FEEDBACK_API === "true",
      },
      providerKeys: {
        kakaoRestApiKey: isConfigured(process.env.KAKAO_REST_API_KEY),
        naverMapClientId: isConfigured(process.env.NAVER_MAP_CLIENT_ID),
        naverMapClientSecret: isConfigured(process.env.NAVER_MAP_CLIENT_SECRET),
        tourApiServiceKey: isConfigured(process.env.TOURAPI_SERVICE_KEY),
        seoulOpenDataKey: isConfigured(process.env.SEOUL_OPEN_DATA_KEY),
      },
      apiShells: {
        mapPreview: "/api/map-preview",
        placeDiscovery: "/api/place-discovery",
        feedback: "/api/feedback",
      },
      dataMode: "fallback-first",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
