"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Download, Flag, GitPullRequestArrow, Layers3, MessageSquareWarning, RefreshCw } from "lucide-react";
import { buildBetaTriageReport, type TriageIssue, type TriagePriority } from "@/lib/beta-triage";
import { LANDLY_RELEASE_NAME, LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function priorityTone(priority: TriagePriority) {
  if (priority === "p0") return "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200";
  if (priority === "p1") return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200";
  if (priority === "p2") return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200";
  return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

function priorityLabel(priority: TriagePriority) {
  return {
    p0: "P0 blocker",
    p1: "P1 next patch",
    p2: "P2 beta polish",
    p3: "P3 backlog",
  }[priority];
}

function formatDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function FeedbackTriageDashboard() {
  const { lt } = useLocalizedText();
  const state = useAppStore();
  const showSnackbar = useAppStore((store) => store.showSnackbar);

  const report = useMemo(() => buildBetaTriageReport({
    userFeedbackRecords: state.userFeedbackRecords,
    betaFeedbackRecords: state.betaFeedbackRecords,
    translationFeedbackRecords: state.translationFeedbackRecords,
    version: "v54",
  }), [state.userFeedbackRecords, state.betaFeedbackRecords, state.translationFeedbackRecords]);

  const grouped = report.issues.reduce<Record<TriagePriority, TriageIssue[]>>(
    (acc, issue) => {
      acc[issue.priority].push(issue);
      return acc;
    },
    { p0: [], p1: [], p2: [], p3: [] }
  );

  const handleExport = () => {
    const payload = {
      ...report,
      release: {
        version: LANDLY_RELEASE_VERSION,
        name: LANDLY_RELEASE_NAME,
      },
      profile: {
        language: state.user.language,
        mode: state.user.mode,
        city: state.user.city,
        isBetaTester: state.isBetaTester,
      },
      rawSignals: {
        userFeedbackRecords: state.userFeedbackRecords,
        betaFeedbackRecords: state.betaFeedbackRecords,
        translationFeedbackRecords: state.translationFeedbackRecords,
      },
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`landly-beta-triage-report-${date}.json`, payload);
    showSnackbar(lt("Beta triage report downloaded"), "success");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm dark:border-indigo-900 dark:from-indigo-950/30 dark:to-gray-950">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-indigo-600 p-2 text-white">
            <GitPullRequestArrow size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{lt("Beta triage")}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-gray-50">{LANDLY_RELEASE_VERSION} · {lt("Feedback priority board")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {lt("Turn local tester notes, beta mission feedback, and translation reports into a prioritized patch queue before the next release.")}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric label="Signals" value={report.metrics.totalSignals} detail="feedback + QA" />
          <Metric label="Issues" value={report.metrics.issueCount} detail="triaged groups" />
          <Metric label="P0/P1" value={`${report.metrics.p0Count}/${report.metrics.p1Count}`} detail="urgent queue" tone={report.metrics.p0Count > 0 ? "rose" : report.metrics.p1Count > 0 ? "amber" : "emerald"} />
          <Metric label="Avg score" value={report.metrics.averageRating ?? "—"} detail="clarity rating" />
        </div>

        <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-3 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-gray-950 dark:text-indigo-200">
          <div className="flex items-start gap-2">
            {report.metrics.p0Count > 0 ? <AlertTriangle size={16} className="mt-0.5 text-rose-600" /> : <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />}
            <div>
              <p className="font-bold">{lt("Recommended next patch")}</p>
              <p className="mt-1 text-xs leading-relaxed opacity-80">{lt(report.recommendedNextPatch)}</p>
              {report.metrics.topContext ? <p className="mt-1 text-[11px] opacity-70">{lt("Top context")}: {report.metrics.topContext}</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99] dark:bg-white dark:text-gray-950"
          >
            <Download size={16} />
            {lt("Export triage report")}
          </button>
          <Link href="/admin" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 active:scale-[0.99] dark:border-gray-700 dark:text-gray-100">
            <Layers3 size={16} />
            {lt("Operator insights")}
          </Link>
          <Link href="/launch" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 px-4 py-3 text-sm font-bold text-sky-800 active:scale-[0.99] dark:border-sky-800 dark:text-sky-200">
            <Flag size={16} />
            {lt("Launch control")}
          </Link>
          <Link href="/plan" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-800 active:scale-[0.99] dark:border-emerald-800 dark:text-emerald-200">
            <ClipboardCheck size={16} />
            {lt("Patch plan")}
          </Link>
        </div>
      </section>

      {report.issues.length === 0 ? (
        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <RefreshCw size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt("No triage issues yet")}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {lt("Ask a tester to complete the launch checklist, leave page-level feedback, or report a translation issue. This board will group the next patch queue automatically.")}
              </p>
            </div>
          </div>
        </section>
      ) : (
        (["p0", "p1", "p2", "p3"] as TriagePriority[]).map((priority) => {
          const issues = grouped[priority];
          if (issues.length === 0) return null;
          return (
            <section key={priority} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquareWarning size={18} className={priority === "p0" ? "text-rose-600" : priority === "p1" ? "text-amber-600" : "text-sky-600"} />
                  <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt(priorityLabel(priority))}</h3>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${priorityTone(priority)}`}>{issues.length}</span>
              </div>
              <div className="mt-3 space-y-3">
                {issues.map((issue) => (
                  <article key={issue.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt(issue.title)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{lt(issue.summary)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${priorityTone(issue.priority)}`}>{issue.priority}</span>
                    </div>
                    <div className="mt-3 grid gap-2 text-[11px] text-gray-500 dark:text-gray-400 sm:grid-cols-3">
                      <span>{lt("Area")}: {lt(issue.area)}</span>
                      <span>{lt("Source")}: {lt(issue.source)}</span>
                      <span>{lt("Seen")}: {formatDate(issue.firstSeenAt)} → {formatDate(issue.lastSeenAt)}</span>
                    </div>
                    <div className="mt-3 rounded-2xl bg-white p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{lt("Suggested action")}</p>
                      <p className="mt-1">{lt(issue.suggestedAction)}</p>
                    </div>
                    {issue.evidence.length > 0 ? (
                      <div className="mt-3 space-y-1">
                        {issue.evidence.slice(0, 3).map((evidence, index) => (
                          <p key={`${issue.id}-${index}`} className="rounded-xl bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-500 dark:bg-gray-950 dark:text-gray-400">“{evidence}”</p>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function Metric({ label, value, detail, tone = "sky" }: { label: string; value: string | number; detail: string; tone?: "sky" | "emerald" | "amber" | "rose" }) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900"
      : tone === "rose"
      ? "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900"
      : "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900";
  return (
    <div className={`rounded-2xl p-3 ring-1 ${toneClass}`}>
      <p className="text-[11px] font-semibold opacity-75">{label}</p>
      <p className="mt-1 text-xl font-extrabold">{value}</p>
      <p className="mt-0.5 text-[11px] opacity-75">{detail}</p>
    </div>
  );
}
