import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const requiredFiles = [
  "app/api/health/route.ts",
  "app/api/map-preview/route.ts",
  "app/api/place-discovery/route.ts",
  "app/api/feedback/route.ts",
  "app/admin/page.tsx",
  "app/error.tsx",
  "app/not-found.tsx",
  "components/admin/operator-insights-dashboard.tsx",
  "components/common/feedback-prompt.tsx",
  "components/profile/feedback-insights-panel.tsx",
  "components/trust/release-readiness-panel.tsx",
  "data/release-readiness.ts",
  "lib/release-metadata.ts",
  "PATCH_NOTES_v51.md",
  "CHATGPT_HANDOFF_v51.md",
  "i18n/messages/ja.json",
  "i18n/messages/zh.json",
  "scripts/audit-feedback-readiness.mjs",
  "scripts/audit-admin-readiness.mjs",
];

const checks = [];
function addCheck(name, ok, detail) {
  checks.push({ name, ok, detail });
}

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

for (const file of requiredFiles) {
  addCheck(`required file: ${file}`, fs.existsSync(path.join(projectRoot, file)), "file exists");
}

const packageJson = JSON.parse(read("package.json"));
addCheck("package script audit:release", packageJson.scripts?.["audit:release"] === "node scripts/audit-release-readiness.mjs", "script is registered");
addCheck("package script audit:feedback", packageJson.scripts?.["audit:feedback"] === "node scripts/audit-feedback-readiness.mjs", "feedback audit script is registered");
addCheck("package script audit:admin", packageJson.scripts?.["audit:admin"] === "node scripts/audit-admin-readiness.mjs", "admin audit script is registered");

const serviceWorker = read("public/sw.js");
addCheck("service worker version v51", serviceWorker.includes('LANDLY_SW_VERSION = "v51"'), "public/sw.js cache version is v51");
addCheck("service worker caches admin", serviceWorker.includes('"/admin"'), "admin route is included in the offline cache list");

const releaseMetadata = read("lib/release-metadata.ts");
addCheck("release metadata version v51", releaseMetadata.includes('LANDLY_RELEASE_VERSION = "v51"'), "release metadata is v51");
addCheck("release metadata includes operator insights", releaseMetadata.includes("operator-insights"), "release checks mention operator insights");
addCheck("release metadata includes admin route", releaseMetadata.includes('"/admin"'), "admin route is included in core routes");

const backupCard = read("components/profile/data-export-card.tsx");
addCheck("backup export version v51", backupCard.includes('version: "v51"'), "backup metadata is v51");
addCheck("backup includes user feedback", backupCard.includes("userFeedbackRecords"), "feedback records are included in backup");

const betaReport = read("components/test/beta-report-export-panel.tsx");
addCheck("beta report export version v51", betaReport.includes('version: "v51"'), "beta report metadata is v51");

const feedbackInsights = read("components/profile/feedback-insights-panel.tsx");
addCheck("feedback export version v51", feedbackInsights.includes('version: "v51"'), "feedback export metadata is v51");

const trustPage = read("app/trust/page.tsx");
addCheck("trust page shows release readiness", trustPage.includes("ReleaseReadinessPanel"), "Trust Center includes release panel");

const healthRoute = read("app/api/health/route.ts");
addCheck("health route includes feedback API", healthRoute.includes('feedback: "/api/feedback"') && healthRoute.includes("feedbackApi"), "health reports feedback API readiness");
addCheck("health route includes admin tools", healthRoute.includes("adminTools") && healthRoute.includes('admin: "/admin"'), "health reports admin tooling readiness");

const envExample = read(".env.example");
addCheck("feedback url env documented", envExample.includes("NEXT_PUBLIC_FEEDBACK_URL"), "feedback env var is documented");
addCheck("feedback API env documented", envExample.includes("NEXT_PUBLIC_ENABLE_FEEDBACK_API") && envExample.includes("LANDLY_FEEDBACK_WEBHOOK_URL"), "feedback API env vars are documented");
addCheck("admin env documented", envExample.includes("NEXT_PUBLIC_ENABLE_ADMIN_TOOLS"), "admin tools env var is documented");
addCheck("api provider env documented", envExample.includes("KAKAO_REST_API_KEY") && envExample.includes("TOURAPI_SERVICE_KEY"), "provider env keys are documented");

const phraseAudit = read("scripts/audit-phrase-coverage.mjs");
addCheck("phrase audit can check zh/ja/es/fr", ["zh", "ja", "es", "fr"].every((lang) => phraseAudit.includes(`\"${lang}\"`) || phraseAudit.includes(`'${lang}'`)), "phrase audit covers expected languages");

const feedbackAudit = read("scripts/audit-feedback-readiness.mjs");
addCheck("feedback audit checks v51 backup", feedbackAudit.includes('version: "v51"') && feedbackAudit.includes("userFeedbackRecords"), "feedback audit checks v51 feedback backup");

const adminAudit = read("scripts/audit-admin-readiness.mjs");
addCheck("admin audit checks operator snapshot", adminAudit.includes("landly-operator-snapshot") && adminAudit.includes('version: "v51"'), "admin audit checks snapshot export");

console.log("Landly release readiness audit");
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name} — ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} release readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nAll release readiness checks passed.");
process.exit(0);
