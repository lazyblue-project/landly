import { LANDLY_RELEASE_CHECKS, LANDLY_RELEASE_DATE, LANDLY_RELEASE_NAME, LANDLY_RELEASE_SUMMARY, LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";

export type ReleaseReadinessStatus = "ready" | "guarded" | "watch";

export const releaseReadiness = {
  version: LANDLY_RELEASE_VERSION,
  name: LANDLY_RELEASE_NAME,
  date: LANDLY_RELEASE_DATE,
  summary: LANDLY_RELEASE_SUMMARY,
  checks: LANDLY_RELEASE_CHECKS,
  nextSteps: [
    "Run npm run audit:release, npm run audit:feedback, npm run audit:admin, and npm run audit:launch before every patch zip or Vercel deployment.",
    "Open /launch before sharing a tester link, export the launch report, then open /admin after each tester round to convert repeated confusing moments into the next patch priorities.",
    "Keep /api/feedback in guarded mode until a server-side webhook or database is intentionally connected.",
    "Use /api/health as a quick deployment smoke check after publishing to Vercel.",
  ],
} as const;
