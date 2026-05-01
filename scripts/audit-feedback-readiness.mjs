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
  "components/common/feedback-prompt.tsx",
  "components/profile/feedback-insights-panel.tsx",
  "app/api/feedback/route.ts",
  "store/app-store.ts",
  "types/index.ts",
  "components/profile/data-export-card.tsx",
];

for (const file of requiredFiles) {
  addCheck(`required file: ${file}`, fs.existsSync(path.join(projectRoot, file)), "file exists");
}

const types = read("types/index.ts");
addCheck("UserFeedbackRecord type", types.includes("export interface UserFeedbackRecord"), "feedback record schema exists");
addCheck("UserFeedbackCategory type", types.includes("export type UserFeedbackCategory"), "feedback category enum exists");

const store = read("store/app-store.ts");
addCheck("feedback persisted in store", store.includes("userFeedbackRecords") && store.includes("addUserFeedbackRecord"), "store can save feedback records");

const prompt = read("components/common/feedback-prompt.tsx");
addCheck("feedback prompt uses local store", prompt.includes("addUserFeedbackRecord"), "prompt writes local feedback");
addCheck("feedback prompt references API gate", prompt.includes("isFeedbackApiEnabled"), "prompt can optionally send to API");

const insights = read("components/profile/feedback-insights-panel.tsx");
addCheck("My feedback insights export", insights.includes("landly-user-feedback") && insights.includes("Export feedback JSON"), "feedback export is available");

const backup = read("components/profile/data-export-card.tsx");
addCheck("backup includes user feedback", backup.includes("userFeedbackRecords") && backup.includes('version: "v51"'), "backup exports v51 feedback records");

const api = read("app/api/feedback/route.ts");
addCheck("feedback API is guarded", api.includes("not-persisted-in-this-mvp-api-stub") && api.includes("LANDLY_FEEDBACK_WEBHOOK_URL"), "API validates but does not persist by default");

const env = read(".env.example");
addCheck("feedback env documented", env.includes("NEXT_PUBLIC_ENABLE_FEEDBACK_API") && env.includes("LANDLY_FEEDBACK_WEBHOOK_URL"), "feedback env vars are documented");

console.log("Landly feedback readiness audit");
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name} — ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} feedback readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nAll feedback readiness checks passed.");
process.exit(0);