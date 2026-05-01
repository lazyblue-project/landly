export const LANDLY_RELEASE_VERSION = "v50";
export const LANDLY_RELEASE_NAME = "Beta Launch Feedback Loop";
export const LANDLY_RELEASE_DATE = "2026-05-02";

export const LANDLY_RELEASE_SUMMARY =
  "Adds a production-safe in-app feedback loop, local feedback insights, and a guarded feedback API stub for beta launch learning.";

export const LANDLY_CORE_ROUTES = [
  "/",
  "/onboarding",
  "/offline",
  "/sos",
  "/assistant",
  "/care",
  "/pass",
  "/shop",
  "/stay",
  "/life",
  "/my",
  "/trust",
  "/calendar",
  "/explore",
  "/more",
] as const;

export const LANDLY_RELEASE_CHECKS = [
  {
    id: "safe-fallbacks",
    label: "Safe route fallbacks",
    status: "ready",
    detail: "App-level error and not-found pages guide users back to Home, SOS, Trust, or Offline flows.",
  },
  {
    id: "health-endpoint",
    label: "Health endpoint",
    status: "ready",
    detail: "/api/health exposes release version, feature flag state, provider key presence, API shells, and core route count.",
  },
  {
    id: "feedback-loop",
    label: "In-app feedback loop",
    status: "ready",
    detail: "Every FeedbackPrompt can save page-level notes locally, and My shows feedback counts, average score, categories, and JSON export.",
  },
  {
    id: "feedback-api-stub",
    label: "Feedback API stub",
    status: "guarded",
    detail: "/api/feedback validates payloads but does not persist data until a server-side webhook or database is intentionally connected.",
  },
  {
    id: "release-audit",
    label: "Release audit script",
    status: "ready",
    detail: "npm run audit:release checks phrase coverage, service worker version, feedback loop files, required docs, and API shells.",
  },
  {
    id: "api-live-data",
    label: "Live data providers",
    status: "guarded",
    detail: "Map and place discovery APIs still return safe fallback metadata until server-side keys and policies are finalized.",
  },
] as const;
