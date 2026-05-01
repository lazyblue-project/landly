export const LANDLY_RELEASE_VERSION = "v53";
export const LANDLY_RELEASE_NAME = "Beta Feedback Triage Board";
export const LANDLY_RELEASE_DATE = "2026-05-02";

export const LANDLY_RELEASE_SUMMARY =
  "Adds a guarded beta triage board, local-first triage report export, /api/triage analysis shell, and release audits for prioritizing the next patch from tester signals.";

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
  "/admin",
  "/launch",
  "/triage",
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
    id: "triage-board",
    label: "Beta feedback triage",
    status: "ready",
    detail: "A guarded /triage page turns local tester notes, beta mission feedback, and translation reports into P0/P1/P2/P3 patch priorities.",
  },
  {
    id: "triage-api-stub",
    label: "Triage API stub",
    status: "guarded",
    detail: "/api/triage accepts local feedback arrays and returns a computed triage report without persisting payloads.",
  },
  {
    id: "launch-control",
    label: "Beta launch control",
    status: "ready",
    detail: "A guarded /launch page turns local tester signals into a required launch checklist, readiness score, and exportable launch report.",
  },
  {
    id: "operator-insights",
    label: "Operator insights",
    status: "ready",
    detail: "A guarded /admin page summarizes feedback, translation QA, saved-item activity, feature flags, and exports an operator snapshot.",
  },
  {
    id: "feedback-loop",
    label: "In-app feedback loop",
    status: "ready",
    detail: "FeedbackPrompt can save page-level notes locally, and My shows feedback counts, average score, categories, and JSON export."
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
    detail: "npm run audit:release checks phrase coverage, service worker version, triage/launch/admin/feedback files, required docs, and API shells.",
  },
  {
    id: "api-live-data",
    label: "Live data providers",
    status: "guarded",
    detail: "Map and place discovery APIs still return safe fallback metadata until server-side keys and policies are finalized.",
  },
] as const;
