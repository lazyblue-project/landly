export const LANDLY_RELEASE_VERSION = "v49";
export const LANDLY_RELEASE_NAME = "QA Guardrails & Release Health";
export const LANDLY_RELEASE_DATE = "2026-05-02";

export const LANDLY_RELEASE_SUMMARY =
  "Adds release-readiness checks, safe error fallbacks, and a lightweight health endpoint before live API rollout.";

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
    detail: "/api/health exposes release version, feature flag state, provider key presence, and core route count.",
  },
  {
    id: "release-audit",
    label: "Release audit script",
    status: "ready",
    detail: "npm run audit:release checks phrase coverage, service worker version, required files, docs, and API shells.",
  },
  {
    id: "api-live-data",
    label: "Live data providers",
    status: "guarded",
    detail: "Map and place discovery APIs still return safe fallback metadata until server-side keys and policies are finalized.",
  },
] as const;
