import { LANDLY_RELEASE_CHECKS, LANDLY_RELEASE_DATE, LANDLY_RELEASE_NAME, LANDLY_RELEASE_SUMMARY, LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";

export type ReleaseReadinessStatus = "ready" | "guarded" | "watch";

export const releaseReadiness = {
  version: LANDLY_RELEASE_VERSION,
  name: LANDLY_RELEASE_NAME,
  date: LANDLY_RELEASE_DATE,
  summary: LANDLY_RELEASE_SUMMARY,
  checks: LANDLY_RELEASE_CHECKS,
  nextSteps: [
    "Run npm run audit:release before every patch zip or Vercel deployment.",
    "Keep API providers in fallback mode until server-side key handling, quota rules, and user-facing freshness labels are verified.",
    "Use /api/health as a quick deployment smoke check after publishing to Vercel.",
  ],
} as const;
