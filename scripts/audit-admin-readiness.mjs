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
  "app/admin/page.tsx",
  "components/admin/operator-insights-dashboard.tsx",
  "lib/feature-flags.ts",
  "app/more/page.tsx",
  "app/api/health/route.ts",
  "lib/release-metadata.ts",
  "PATCH_NOTES_v51.md",
  "CHATGPT_HANDOFF_v51.md",
];

for (const file of requiredFiles) {
  addCheck(`required file: ${file}`, fs.existsSync(path.join(projectRoot, file)), "file exists");
}

const adminPage = read("app/admin/page.tsx");
addCheck("admin route is guarded", adminPage.includes("isAdminToolsEnabled") && adminPage.includes("Enable beta tester mode"), "admin page has local beta/admin gate");
addCheck("admin dashboard rendered", adminPage.includes("OperatorInsightsDashboard"), "admin page renders insights dashboard when enabled");

const dashboard = read("components/admin/operator-insights-dashboard.tsx");
addCheck("operator snapshot export", dashboard.includes("landly-operator-snapshot") && dashboard.includes('version: "v51"'), "dashboard exports v51 operator snapshot");
addCheck("dashboard uses local feedback", dashboard.includes("userFeedbackRecords") && dashboard.includes("translationFeedbackRecords"), "dashboard summarizes local feedback and translation QA");
addCheck("dashboard links health API", dashboard.includes('href="/api/health"'), "dashboard links health API smoke check");

const flags = read("lib/feature-flags.ts");
addCheck("admin feature flag", flags.includes("isAdminToolsEnabled") && flags.includes("NEXT_PUBLIC_ENABLE_ADMIN_TOOLS"), "admin tools env gate exists");

const morePage = read("app/more/page.tsx");
addCheck("more page admin link", morePage.includes('href="/admin"') && morePage.includes("Operator Insights"), "beta tools area links admin dashboard");

const bottomNav = read("components/layout/bottom-nav.tsx");
addCheck("admin grouped under more", bottomNav.includes('"/admin"'), "bottom nav treats admin as More section");

const health = read("app/api/health/route.ts");
addCheck("health reports admin flag", health.includes("adminTools") && health.includes('admin: "/admin"'), "health includes admin flag and admin shell link");

const env = read(".env.example");
addCheck("admin env documented", env.includes("NEXT_PUBLIC_ENABLE_ADMIN_TOOLS"), "admin tools env var is documented");

const release = read("lib/release-metadata.ts");
addCheck("release metadata v51", release.includes('LANDLY_RELEASE_VERSION = "v51"') && release.includes("operator-insights"), "release metadata describes v51 admin insights");
addCheck("admin route registered", release.includes('"/admin"'), "admin route is in core routes");

console.log("Landly admin readiness audit");
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name} — ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} admin readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nAll admin readiness checks passed.");
process.exit(0);