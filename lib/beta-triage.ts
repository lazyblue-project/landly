import type { BetaFeedbackRecord, TranslationFeedbackRecord, UserFeedbackCategory, UserFeedbackRecord } from "@/types";

export type TriagePriority = "p0" | "p1" | "p2" | "p3";
export type TriageArea = "safety" | "core-ux" | "translation" | "data-trust" | "commercial" | "operations";
export type TriageSource = "user-feedback" | "beta-mission" | "translation-feedback" | "system";

export interface TriageIssue {
  id: string;
  title: string;
  summary: string;
  priority: TriagePriority;
  area: TriageArea;
  source: TriageSource;
  count: number;
  score: number;
  contexts: string[];
  suggestedAction: string;
  evidence: string[];
  firstSeenAt?: string;
  lastSeenAt?: string;
}

export interface BetaTriageReport {
  generatedAt: string;
  version: string;
  schema: "landly-beta-triage";
  metrics: {
    totalSignals: number;
    issueCount: number;
    p0Count: number;
    p1Count: number;
    averageRating: number | null;
    negativeSignalCount: number;
    translationIssueCount: number;
    topContext?: string;
  };
  recommendedNextPatch: string;
  issues: TriageIssue[];
}

const categoryLabels: Record<UserFeedbackCategory, string> = {
  useful: "Useful",
  confusing: "Confusing",
  missing: "Missing",
  bug: "Bug",
  idea: "Idea",
};

function clampEvidence(note?: string) {
  const trimmed = note?.trim();
  if (!trimmed) return "No note provided";
  return trimmed.length > 180 ? `${trimmed.slice(0, 177)}...` : trimmed;
}

function priorityRank(priority: TriagePriority) {
  return { p0: 0, p1: 1, p2: 2, p3: 3 }[priority];
}

function dateRange(records: Array<{ createdAt: string }>) {
  const sorted = records
    .map((record) => record.createdAt)
    .filter(Boolean)
    .sort();
  return { firstSeenAt: sorted[0], lastSeenAt: sorted[sorted.length - 1] };
}

function chooseArea(context: string, category?: UserFeedbackCategory): TriageArea {
  const key = context.toLowerCase();
  if (key.includes("sos") || key.includes("emergency") || key.includes("care") || key.includes("offline")) return "safety";
  if (key.includes("trust") || key.includes("map") || key.includes("api") || key.includes("place")) return "data-trust";
  if (key.includes("partner") || key.includes("offer") || key.includes("promotion")) return "commercial";
  if (key.includes("admin") || key.includes("launch") || key.includes("health")) return "operations";
  if (category === "bug") return "core-ux";
  return "core-ux";
}

function userPriority(category: UserFeedbackCategory, avgRating: number, count: number, area: TriageArea): TriagePriority {
  if (area === "safety" && (category === "bug" || avgRating <= 2)) return "p0";
  if (category === "bug" && avgRating <= 2) return "p0";
  if (category === "bug" || avgRating <= 2 || count >= 3) return "p1";
  if (category === "confusing" || category === "missing") return "p2";
  return "p3";
}

function nextActionForUserIssue(category: UserFeedbackCategory, area: TriageArea) {
  if (area === "safety") return "Run the SOS/Care/offline flow manually, patch unsafe copy or broken routes first, then re-run launch smoke checks.";
  if (category === "bug") return "Reproduce the bug from the saved context/path, add a small regression guard, and patch before the next tester round.";
  if (category === "confusing") return "Simplify the screen copy, reduce choices, or add a clearer primary CTA on the affected page.";
  if (category === "missing") return "Add the missing content, fallback, or empty-state guidance before expanding new features.";
  if (category === "idea") return "Move to backlog unless it overlaps with multiple confusing or missing signals.";
  return "Keep as positive evidence and reuse the pattern in adjacent flows.";
}

function pushIssue(issues: TriageIssue[], issue: TriageIssue) {
  issues.push(issue);
}

export function buildBetaTriageReport(input: {
  userFeedbackRecords?: UserFeedbackRecord[];
  betaFeedbackRecords?: BetaFeedbackRecord[];
  translationFeedbackRecords?: TranslationFeedbackRecord[];
  generatedAt?: string;
  version?: string;
}): BetaTriageReport {
  const userFeedbackRecords = input.userFeedbackRecords ?? [];
  const betaFeedbackRecords = input.betaFeedbackRecords ?? [];
  const translationFeedbackRecords = input.translationFeedbackRecords ?? [];
  const issues: TriageIssue[] = [];

  const userGroups = new Map<string, UserFeedbackRecord[]>();
  for (const record of userFeedbackRecords) {
    if (record.category === "useful") continue;
    const context = record.context || record.path || "General";
    const key = `${record.category}::${context}`;
    userGroups.set(key, [...(userGroups.get(key) ?? []), record]);
  }

  for (const [key, records] of userGroups.entries()) {
    const [categoryRaw, context] = key.split("::");
    const category = categoryRaw as UserFeedbackCategory;
    const avgRating = records.reduce((sum, record) => sum + record.rating, 0) / Math.max(records.length, 1);
    const area = chooseArea(context, category);
    const priority = userPriority(category, avgRating, records.length, area);
    const { firstSeenAt, lastSeenAt } = dateRange(records);
    pushIssue(issues, {
      id: `uf-${category}-${context.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "general"}`,
      title: `${categoryLabels[category]} signal in ${context}`,
      summary: `${records.length} tester note(s), average clarity score ${avgRating.toFixed(1)}/5.`,
      priority,
      area,
      source: "user-feedback",
      count: records.length,
      score: Number((records.length * 10 + (5 - avgRating) * 8 + (priority === "p0" ? 60 : priority === "p1" ? 35 : priority === "p2" ? 15 : 5)).toFixed(1)),
      contexts: Array.from(new Set(records.map((record) => record.path || record.context || "General"))).slice(0, 6),
      suggestedAction: nextActionForUserIssue(category, area),
      evidence: records.slice(0, 5).map((record) => clampEvidence(record.note)),
      firstSeenAt,
      lastSeenAt,
    });
  }

  const betaGroups = new Map<string, BetaFeedbackRecord[]>();
  for (const record of betaFeedbackRecords) {
    if (record.mood === "worked") continue;
    const key = `${record.mood}::${record.missionId}`;
    betaGroups.set(key, [...(betaGroups.get(key) ?? []), record]);
  }

  for (const [key, records] of betaGroups.entries()) {
    const [mood, mission] = key.split("::");
    const avgRating = records.reduce((sum, record) => sum + record.rating, 0) / Math.max(records.length, 1);
    const area = mission === "sos" || mission === "care" ? "safety" : "core-ux";
    const priority: TriagePriority = area === "safety" && avgRating <= 2 ? "p0" : avgRating <= 2 || mood === "missing" ? "p1" : "p2";
    const { firstSeenAt, lastSeenAt } = dateRange(records);
    pushIssue(issues, {
      id: `beta-${mood}-${mission}`,
      title: `Beta mission issue: ${mission}`,
      summary: `${records.length} mission note(s) marked ${mood}, average rating ${avgRating.toFixed(1)}/5.`,
      priority,
      area,
      source: "beta-mission",
      count: records.length,
      score: Number((records.length * 9 + (5 - avgRating) * 7 + (priority === "p0" ? 55 : priority === "p1" ? 30 : 12)).toFixed(1)),
      contexts: [mission],
      suggestedAction: "Replay the beta mission, compare expected success signal with the tester note, and patch the smallest blocking step first.",
      evidence: records.slice(0, 5).map((record) => clampEvidence(record.note)),
      firstSeenAt,
      lastSeenAt,
    });
  }

  const translationGroups = new Map<string, TranslationFeedbackRecord[]>();
  for (const record of translationFeedbackRecords) {
    const key = `${record.language}::${record.reason}`;
    translationGroups.set(key, [...(translationGroups.get(key) ?? []), record]);
  }

  for (const [key, records] of translationGroups.entries()) {
    const [language, reason] = key.split("::");
    const priority: TriagePriority = reason === "missing_language" || reason === "wrong_translation" ? "p1" : records.length >= 3 ? "p2" : "p3";
    const { firstSeenAt, lastSeenAt } = dateRange(records);
    pushIssue(issues, {
      id: `tr-${language}-${reason}`,
      title: `Translation QA: ${language} / ${reason.replace(/_/g, " ")}`,
      summary: `${records.length} phrase report(s) need language QA before broader tester rollout.`,
      priority,
      area: "translation",
      source: "translation-feedback",
      count: records.length,
      score: Number((records.length * 8 + (priority === "p1" ? 28 : priority === "p2" ? 14 : 6)).toFixed(1)),
      contexts: Array.from(new Set(records.map((record) => record.phraseCategory))).slice(0, 6),
      suggestedAction: "Review affected phrase cards, update localized text/romanization, and re-run npm run audit:phrases.",
      evidence: records.slice(0, 5).map((record) => `${record.phraseId}: ${clampEvidence(record.note)}`),
      firstSeenAt,
      lastSeenAt,
    });
  }

  const contextCounts = userFeedbackRecords.reduce<Record<string, number>>((acc, record) => {
    const key = record.path || record.context || "General";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const topContext = Object.entries(contextCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const sortedIssues = issues.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.score - a.score || b.count - a.count);
  const ratings = [...userFeedbackRecords.map((record) => record.rating), ...betaFeedbackRecords.map((record) => record.rating)];
  const averageRating = ratings.length > 0 ? Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)) : null;
  const p0Count = sortedIssues.filter((issue) => issue.priority === "p0").length;
  const p1Count = sortedIssues.filter((issue) => issue.priority === "p1").length;
  const negativeSignalCount = userFeedbackRecords.filter((record) => ["confusing", "missing", "bug"].includes(record.category)).length + betaFeedbackRecords.filter((record) => record.mood !== "worked").length;

  const recommendedNextPatch = p0Count > 0
    ? "Patch P0 safety/blocker issues before any new feature work."
    : p1Count > 0
    ? "Use the next patch for P1 usability, missing-flow, or translation fixes."
    : sortedIssues.length > 0
    ? "Batch P2/P3 polish into the next beta iteration."
    : "No critical triage signals yet; run another tester round or broaden feedback collection.";

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    version: input.version ?? "v54",
    schema: "landly-beta-triage",
    metrics: {
      totalSignals: userFeedbackRecords.length + betaFeedbackRecords.length + translationFeedbackRecords.length,
      issueCount: sortedIssues.length,
      p0Count,
      p1Count,
      averageRating,
      negativeSignalCount,
      translationIssueCount: translationFeedbackRecords.length,
      topContext,
    },
    recommendedNextPatch,
    issues: sortedIssues,
  };
}
