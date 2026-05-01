import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const checks = [];

function addCheck(name, ok, detail) {
  checks.push({ name, ok, detail });
}

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

const requiredFiles = [
  "app/triage/page.tsx",
  "app/api/triage/route.ts",
  "components/admin/feedback-triage-dashboard.tsx",
  "lib/beta-triage.ts",
  "lib/feature-flags.ts",
  "app/more/page.tsx",
  "app/api/health/route.ts",
  "components/layout/bottom-nav.tsx",
  "lib/release-metadata.ts",
  "PATCH_NOTES_v53.md",
  "CHATGPT_HANDOFF_v53.md",
];

for (const file of requiredFiles) {
  addCheck(`required file: ${file}`, fs.existsSync(path.join(projectRoot, file)), "file exists");
}

const triagePage = read("app/triage/page.tsx");
addCheck("triage route is guarded", triagePage.includes("isTriageToolsEnabled") && triagePage.includes("Enable beta tester mode"), "triage page has local beta/admin gate");
addCheck("triage dashboard rendered", triagePage.includes("FeedbackTriageDashboard"), "triage page renders triage dashboard when enabled");

const triageComponent = read("components/admin/feedback-triage-dashboard.tsx");
addCheck("triage report export", triageComponent.includes("landly-beta-triage-report") && triageComponent.includes('version: "v53"'), "triage component exports v53 report");
addCheck("triage component uses all signal types", triageComponent.includes("userFeedbackRecords") && triageComponent.includes("betaFeedbackRecords") && triageComponent.includes("translationFeedbackRecords"), "triage component summarizes local feedback, beta, and translation signals");
addCheck("triage component shows patch recommendation", triageComponent.includes("Recommended next patch") && triageComponent.includes("report.recommendedNextPatch"), "triage dashboard surfaces next patch guidance");

const triageLib = read("lib/beta-triage.ts");
addCheck("triage builder exists", triageLib.includes("buildBetaTriageReport") && triageLib.includes("landly-beta-triage"), "triage report builder exists");
addCheck("triage priorities exist", ["p0", "p1", "p2", "p3"].every((priority) => triageLib.includes(`\"${priority}\"`)), "triage supports P0-P3 priorities");
addCheck("triage safety priority", triageLib.includes('area === "safety"') && triageLib.includes('return "p0"'), "safety issues can become P0");

const apiRoute = read("app/api/triage/route.ts");
addCheck("triage API GET", apiRoute.includes("export async function GET") && apiRoute.includes("acceptedPayload"), "triage API exposes schema guidance");
addCheck("triage API POST", apiRoute.includes("export async function POST") && apiRoute.includes("buildBetaTriageReport"), "triage API can compute a report from a payload");
addCheck("triage API does not persist", apiRoute.includes("persisted: false"), "triage API marks local-first non-persistence");

const flags = read("lib/feature-flags.ts");
addCheck("triage feature flag", flags.includes("isTriageToolsEnabled") && flags.includes("NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS"), "triage tools env gate exists");

const morePage = read("app/more/page.tsx");
addCheck("more page triage link", morePage.includes('href="/triage"') && morePage.includes("Beta Triage Board"), "beta tools area links triage dashboard");

const bottomNav = read("components/layout/bottom-nav.tsx");
addCheck("triage grouped under more", bottomNav.includes('"/triage"'), "bottom nav treats triage as More section");

const health = read("app/api/health/route.ts");
addCheck("health reports triage flag", health.includes("triageTools") && health.includes('triage: "/triage"'), "health includes triage flag and triage shell link");

const env = read(".env.example");
addCheck("triage env documented", env.includes("NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS"), "triage tools env var is documented");

const release = read("lib/release-metadata.ts");
addCheck("release metadata v53", release.includes('LANDLY_RELEASE_VERSION = "v53"') && release.includes("triage-board"), "release metadata describes v53 triage board");
addCheck("triage route registered", release.includes('"/triage"'), "triage route is in core routes");

console.log("Landly triage readiness audit");
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name} — ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} triage readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nAll triage readiness checks passed.");
process.exit(0);
