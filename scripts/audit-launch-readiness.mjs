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
  "app/launch/page.tsx",
  "components/admin/beta-launch-control-room.tsx",
  "data/beta-launch-checklist.ts",
  "lib/feature-flags.ts",
  "app/more/page.tsx",
  "components/layout/bottom-nav.tsx",
  "app/api/health/route.ts",
  "lib/release-metadata.ts",
  "PATCH_NOTES_v53.md",
  "CHATGPT_HANDOFF_v53.md",
];

for (const file of requiredFiles) {
  addCheck(`required file: ${file}`, fs.existsSync(path.join(projectRoot, file)), "file exists");
}

const launchPage = read("app/launch/page.tsx");
addCheck("launch route is guarded", launchPage.includes("isLaunchToolsEnabled") && launchPage.includes("Enable beta tester mode"), "launch page has local beta/launch gate");
addCheck("launch dashboard rendered", launchPage.includes("BetaLaunchControlRoom"), "launch page renders beta launch control room when enabled");

const launchComponent = read("components/admin/beta-launch-control-room.tsx");
addCheck("launch report export", launchComponent.includes("landly-beta-launch-report") && launchComponent.includes('version: "v53"'), "launch component exports v53 launch report");
addCheck("launch component uses local signals", launchComponent.includes("userFeedbackRecords") && launchComponent.includes("translationFeedbackRecords"), "launch component summarizes local tester signals");
addCheck("launch component links health API", launchComponent.includes('href="/api/health"'), "launch component links health API smoke check");

const checklist = read("data/beta-launch-checklist.ts");
addCheck("required checklist items", checklist.includes("onboarding-smoke") && checklist.includes("health-smoke") && checklist.includes("operator-snapshot"), "launch checklist covers onboarding, health, and operator snapshot");

const flags = read("lib/feature-flags.ts");
addCheck("launch feature flag", flags.includes("isLaunchToolsEnabled") && flags.includes("NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS"), "launch tools env gate exists");

const morePage = read("app/more/page.tsx");
addCheck("more page launch link", morePage.includes('href="/launch"') && morePage.includes("Beta Launch Control"), "beta tools area links launch dashboard");

const bottomNav = read("components/layout/bottom-nav.tsx");
addCheck("launch grouped under more", bottomNav.includes('"/launch"'), "bottom nav treats launch as More section");

const health = read("app/api/health/route.ts");
addCheck("health reports launch flag", health.includes("launchTools") && health.includes('launch: "/launch"'), "health includes launch flag and launch shell link");

const env = read(".env.example");
addCheck("launch env documented", env.includes("NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS"), "launch tools env var is documented");

const release = read("lib/release-metadata.ts");
addCheck("release metadata v53", release.includes('LANDLY_RELEASE_VERSION = "v53"') && release.includes("launch-control"), "release metadata describes v53 launch control");
addCheck("launch route registered", release.includes('"/launch"'), "launch route is in core routes");

console.log("Landly launch readiness audit");
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name} — ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} launch readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nAll launch readiness checks passed.");
process.exit(0);
