import { buildBetaTriageReport, type BetaTriageReport, type TriageArea, type TriageIssue, type TriagePriority } from "@/lib/beta-triage";
import type { BetaFeedbackRecord, TranslationFeedbackRecord, UserFeedbackRecord } from "@/types";

export type PatchPlanStatus = "ready" | "needs-review" | "backlog";
export type PatchPlanWorkstream = "safety" | "ux" | "content" | "data" | "commercial" | "ops";

export interface PatchPlanItem {
  id: string;
  title: string;
  summary: string;
  priority: TriagePriority;
  status: PatchPlanStatus;
  workstream: PatchPlanWorkstream;
  sourceIssueId?: string;
  sourceArea?: TriageArea;
  releaseTarget: string;
  effort: "S" | "M" | "L";
  suggestedOwner: string;
  acceptanceCriteria: string[];
  evidence: string[];
  contexts: string[];
  order: number;
}

export interface BetaPatchPlanReport {
  generatedAt: string;
  version: string;
  schema: "landly-beta-patch-plan";
  summary: {
    totalItems: number;
    readyItems: number;
    blockerItems: number;
    nextPatchItems: number;
    backlogItems: number;
    estimatedSmall: number;
    estimatedMedium: number;
    estimatedLarge: number;
  };
  recommendedPatchName: string;
  recommendedPatchGoal: string;
  triage: Pick<BetaTriageReport, "metrics" | "recommendedNextPatch">;
  items: PatchPlanItem[];
}

function priorityRank(priority: TriagePriority) {
  return { p0: 0, p1: 1, p2: 2, p3: 3 }[priority];
}

function workstreamForArea(area: TriageArea): PatchPlanWorkstream {
  if (area === "safety") return "safety";
  if (area === "translation") return "content";
  if (area === "data-trust") return "data";
  if (area === "commercial") return "commercial";
  if (area === "operations") return "ops";
  return "ux";
}

function ownerForArea(area: TriageArea) {
  if (area === "translation") return "Content / Localization";
  if (area === "data-trust") return "Data / Trust";
  if (area === "safety") return "Product + QA";
  if (area === "operations") return "Operator / Release";
  if (area === "commercial") return "Product / Partnerships";
  return "Product / Frontend";
}

function effortForIssue(issue: TriageIssue): PatchPlanItem["effort"] {
  if (issue.priority === "p0" || issue.count >= 5 || issue.area === "data-trust") return "L";
  if (issue.priority === "p1" || issue.count >= 3) return "M";
  return "S";
}

function statusForIssue(issue: TriageIssue): PatchPlanStatus {
  if (issue.priority === "p0" || issue.priority === "p1") return "ready";
  if (issue.priority === "p2") return "needs-review";
  return "backlog";
}

function targetForPriority(priority: TriagePriority) {
  if (priority === "p0") return "Emergency hotfix before next tester link";
  if (priority === "p1") return "Next patch";
  if (priority === "p2") return "Next beta polish batch";
  return "Backlog review";
}

function criteriaForIssue(issue: TriageIssue) {
  const criteria = [
    "Reproduce or review the exact tester context before changing UI copy or logic.",
    "Patch the smallest user-visible blocker first and keep existing fallback behavior intact.",
    "Re-run the relevant audit script and capture the result in patch notes.",
  ];
  if (issue.area === "safety") criteria.unshift("SOS, Care, and Offline flows remain reachable within two taps after the change.");
  if (issue.area === "translation") criteria.push("Run npm run audit:phrases and verify the affected phrase card manually.");
  if (issue.area === "data-trust") criteria.push("Fallback-first data mode stays explicit; demo or unverified data must not look official.");
  if (issue.source === "user-feedback") criteria.push("The affected page-level feedback context is mentioned in the regression notes.");
  return criteria.slice(0, 5);
}

function itemFromIssue(issue: TriageIssue, order: number): PatchPlanItem {
  return {
    id: `plan-${issue.id}`,
    title: issue.priority === "p0" ? `Hotfix: ${issue.title}` : `Patch: ${issue.title}`,
    summary: `${issue.summary} Suggested action: ${issue.suggestedAction}`,
    priority: issue.priority,
    status: statusForIssue(issue),
    workstream: workstreamForArea(issue.area),
    sourceIssueId: issue.id,
    sourceArea: issue.area,
    releaseTarget: targetForPriority(issue.priority),
    effort: effortForIssue(issue),
    suggestedOwner: ownerForArea(issue.area),
    acceptanceCriteria: criteriaForIssue(issue),
    evidence: issue.evidence.slice(0, 4),
    contexts: issue.contexts.slice(0, 5),
    order,
  };
}

function defaultTesterRoundItem(order: number): PatchPlanItem {
  return {
    id: "plan-run-next-beta-round",
    title: "Run the next beta tester round",
    summary: "No active P0/P1/P2 issues were found. Use the next patch cycle to broaden tester coverage and collect more page-level signals.",
    priority: "p3",
    status: "needs-review",
    workstream: "ops",
    releaseTarget: "Next tester round",
    effort: "S",
    suggestedOwner: "Operator / Release",
    acceptanceCriteria: [
      "Share the beta link with at least three testers using different languages or app modes.",
      "Ask every tester to complete one journey and submit at least one feedback note.",
      "Export operator, launch, triage, and patch-plan reports after the round.",
    ],
    evidence: [],
    contexts: ["/launch", "/triage", "/plan"],
    order,
  };
}

export function buildBetaPatchPlanReport(input: {
  userFeedbackRecords?: UserFeedbackRecord[];
  betaFeedbackRecords?: BetaFeedbackRecord[];
  translationFeedbackRecords?: TranslationFeedbackRecord[];
  generatedAt?: string;
  version?: string;
}): BetaPatchPlanReport {
  const version = input.version ?? "v54";
  const triageReport = buildBetaTriageReport({ ...input, version });
  const items = triageReport.issues
    .map((issue, index) => itemFromIssue(issue, index + 1))
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.order - b.order);

  if (items.length === 0) items.push(defaultTesterRoundItem(1));

  const blockerItems = items.filter((item) => item.priority === "p0").length;
  const nextPatchItems = items.filter((item) => item.priority === "p0" || item.priority === "p1").length;
  const backlogItems = items.filter((item) => item.status === "backlog").length;
  const recommendedPatchGoal = blockerItems > 0
    ? "Resolve blocker/safety issues before expanding the beta audience."
    : nextPatchItems > 0
    ? "Ship the P1 usability and localization fixes from tester feedback."
    : "Keep the next release small: expand tester coverage and batch polish items.";

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    version,
    schema: "landly-beta-patch-plan",
    summary: {
      totalItems: items.length,
      readyItems: items.filter((item) => item.status === "ready").length,
      blockerItems,
      nextPatchItems,
      backlogItems,
      estimatedSmall: items.filter((item) => item.effort === "S").length,
      estimatedMedium: items.filter((item) => item.effort === "M").length,
      estimatedLarge: items.filter((item) => item.effort === "L").length,
    },
    recommendedPatchName: blockerItems > 0 ? "Safety Hotfix" : nextPatchItems > 0 ? "Feedback Fix Pack" : "Beta Coverage Round",
    recommendedPatchGoal,
    triage: { metrics: triageReport.metrics, recommendedNextPatch: triageReport.recommendedNextPatch },
    items,
  };
}
