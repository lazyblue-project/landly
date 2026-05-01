import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const projectRoot = process.cwd();
const requiredFiles = [
  "app/api/health/route.ts",
  "app/api/map-preview/route.ts",
  "app/api/place-discovery/route.ts",
  "app/api/feedback/route.ts",
  "app/error.tsx",
  "app/not-found.tsx",
  "components/common/feedback-prompt.tsx",
  "components/profile/feedback-insights-panel.tsx",
  "components/trust/release-readiness-panel.tsx",
  "data/release-readiness.ts",
  "lib/release-metadata.ts",
  "PATCH_NOTES_v50.md",
  "CHATGPT_HANDOFF_v50.md",
  "i18n/messages/ja.json",
  "i18n/messages/zh.json",
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

const serviceWorker = read("public/sw.js");
addCheck("service worker version v50", serviceWorker.includes('LANDLY_SW_VERSION = "v50"'), "public/sw.js cache version is v50");

const releaseMetadata = read("lib/release-metadata.ts");
addCheck("release metadata version v50", releaseMetadata.includes('LANDLY_RELEASE_VERSION = "v50"'), "release metadata is v50");
addCheck("release metadata includes feedback loop", releaseMetadata.includes("feedback-loop"), "release checks mention feedback loop");

const backupCard = read("components/profile/data-export-card.tsx");
addCheck("backup export version v50", backupCard.includes('version: "v50"'), "backup metadata is v50");
addCheck("backup includes user feedback", backupCard.includes("userFeedbackRecords"), "feedback records are included in backup");

const trustPage = read("app/trust/page.tsx");
addCheck("trust page shows release readiness", trustPage.includes("ReleaseReadinessPanel"), "Trust Center includes release panel");

const healthRoute = read("app/api/health/route.ts");
addCheck("health route includes feedback API", healthRoute.includes('feedback: "/api/feedback"') && healthRoute.includes("feedbackApi"), "health reports feedback API readiness");

const envExample = read(".env.example");
addCheck("feedback url env documented", envExample.includes("NEXT_PUBLIC_FEEDBACK_URL"), "feedback env var is documented");
addCheck("feedback API env documented", envExample.includes("NEXT_PUBLIC_ENABLE_FEEDBACK_API") && envExample.includes("LANDLY_FEEDBACK_WEBHOOK_URL"), "feedback API env vars are documented");
addCheck("api provider env documented", envExample.includes("KAKAO_REST_API_KEY") && envExample.includes("TOURAPI_SERVICE_KEY"), "provider env keys are documented");

const phraseAudit = spawnSync(process.execPath, ["scripts/audit-phrase-coverage.mjs"], {
  cwd: projectRoot,
  encoding: "utf8",
});
addCheck("phrase coverage audit", phraseAudit.status === 0, phraseAudit.stdout.trim() || phraseAudit.stderr.trim());

const feedbackAudit = spawnSync(process.execPath, ["scripts/audit-feedback-readiness.mjs"], {
  cwd: projectRoot,
  encoding: "utf8",
});
addCheck("feedback readiness audit", feedbackAudit.status === 0, feedbackAudit.stdout.trim() || feedbackAudit.stderr.trim());

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
