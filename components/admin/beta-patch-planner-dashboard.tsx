"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ClipboardCheck, Download, FileCheck2, Flag, GitPullRequestArrow, Layers3, Wrench } from "lucide-react";
import { buildBetaPatchPlanReport, type PatchPlanItem, type PatchPlanStatus, type PatchPlanWorkstream } from "@/lib/beta-patch-plan";
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

function priorityTone(priority: PatchPlanItem["priority"]) {
  if (priority === "p0") return "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200";
  if (priority === "p1") return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200";
  if (priority === "p2") return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200";
  return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

function statusTone(status: PatchPlanStatus) {
  if (status === "ready") return "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900";
  if (status === "needs-review") return "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900";
  return "bg-gray-50 text-gray-600 ring-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800";
}

function workstreamLabel(workstream: PatchPlanWorkstream) {
  return { safety: "Safety", ux: "UX", content: "Content", data: "Data Trust", commercial: "Commercial", ops: "Operations" }[workstream];
}

export function BetaPatchPlannerDashboard() {
  const { lt } = useLocalizedText();
  const state = useAppStore();
  const showSnackbar = useAppStore((store) => store.showSnackbar);

  const report = useMemo(() => buildBetaPatchPlanReport({
    userFeedbackRecords: state.userFeedbackRecords,
    betaFeedbackRecords: state.betaFeedbackRecords,
    translationFeedbackRecords: state.translationFeedbackRecords,
    version: "v54",
  }), [state.userFeedbackRecords, state.betaFeedbackRecords, state.translationFeedbackRecords]);

  const grouped = report.items.reduce<Record<PatchPlanWorkstream, PatchPlanItem[]>>((acc, item) => {
    acc[item.workstream].push(item);
    return acc;
  }, { safety: [], ux: [], content: [], data: [], commercial: [], ops: [] });

  const handleExport = () => {
    const payload = {
      ...report,
      release: { version: LANDLY_RELEASE_VERSION, name: LANDLY_RELEASE_NAME },
      profile: { language: state.user.language, mode: state.user.mode, city: state.user.city, isBetaTester: state.isBetaTester },
      rawSignals: {
        userFeedbackRecords: state.userFeedbackRecords,
        betaFeedbackRecords: state.betaFeedbackRecords,
        translationFeedbackRecords: state.translationFeedbackRecords,
      },
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`landly-beta-patch-plan-${date}.json`, payload);
    showSnackbar(lt("Patch plan downloaded"), "success");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm dark:border-emerald-900 dark:from-emerald-950/30 dark:to-gray-950">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-600 p-2 text-white"><ClipboardCheck size={20} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{lt("Patch planner")}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-gray-50">{LANDLY_RELEASE_VERSION} · {lt("Next patch action plan")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{lt("Convert triage signals into concrete patch items with owners, effort, release target, and acceptance criteria.")}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <Metric label={lt("Plan items")} value={report.summary.totalItems} detail={lt(report.recommendedPatchName)} />
          <Metric label={lt("Ready now")} value={report.summary.readyItems} detail={lt("P0/P1 queued")} tone="emerald" />
          <Metric label={lt("Blockers")} value={report.summary.blockerItems} detail={lt("Safety first")} tone={report.summary.blockerItems > 0 ? "rose" : "emerald"} />
          <Metric label={lt("Effort mix")} value={`S${report.summary.estimatedSmall}/M${report.summary.estimatedMedium}/L${report.summary.estimatedLarge}`} detail={lt("Small/Medium/Large")} tone="amber" />
        </div>
        <div className="mt-4 rounded-2xl bg-white/75 p-3 text-sm text-gray-700 ring-1 ring-emerald-100 dark:bg-gray-950/50 dark:text-gray-200 dark:ring-emerald-900">
          <p className="font-bold">{lt("Recommended patch goal")}</p>
          <p className="mt-1 text-xs leading-relaxed opacity-80">{lt(report.recommendedPatchGoal)}</p>
          <p className="mt-1 text-[11px] opacity-70">{lt("Triage basis")}: {lt(report.triage.recommendedNextPatch)}</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <button type="button" onClick={handleExport} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99] dark:bg-white dark:text-gray-950"><Download size={16} />{lt("Export patch plan")}</button>
          <Link href="/triage" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 px-4 py-3 text-sm font-bold text-indigo-800 active:scale-[0.99] dark:border-indigo-800 dark:text-indigo-200"><GitPullRequestArrow size={16} />{lt("Triage board")}</Link>
          <Link href="/launch" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 px-4 py-3 text-sm font-bold text-sky-800 active:scale-[0.99] dark:border-sky-800 dark:text-sky-200"><Flag size={16} />{lt("Launch control")}</Link>
          <Link href="/admin" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 active:scale-[0.99] dark:border-gray-700 dark:text-gray-100"><Layers3 size={16} />{lt("Operator insights")}</Link>
        </div>
      </section>
      {(["safety", "ux", "content", "data", "commercial", "ops"] as PatchPlanWorkstream[]).map((workstream) => {
        const items = grouped[workstream];
        if (items.length === 0) return null;
        return (
          <section key={workstream} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><Wrench size={18} className="text-emerald-600" /><h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt(workstreamLabel(workstream))}</h3></div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">{items.length}</span>
            </div>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1"><p className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt(item.title)}</p><p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{lt(item.summary)}</p></div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${priorityTone(item.priority)}`}>{item.priority}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-[11px] text-gray-500 dark:text-gray-400 sm:grid-cols-4"><span>{lt("Owner")}: {lt(item.suggestedOwner)}</span><span>{lt("Effort")}: {item.effort}</span><span>{lt("Target")}: {lt(item.releaseTarget)}</span><span className={`rounded-full px-2 py-1 text-center font-bold ring-1 ${statusTone(item.status)}`}>{lt(item.status)}</span></div>
                  <div className="mt-3 rounded-2xl bg-white p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-950 dark:text-gray-300"><p className="font-bold text-gray-900 dark:text-gray-100">{lt("Acceptance criteria")}</p><ul className="mt-2 space-y-1">{item.acceptanceCriteria.map((criterion) => (<li key={criterion} className="flex gap-2"><FileCheck2 size={14} className="mt-0.5 shrink-0 text-emerald-600" /><span>{lt(criterion)}</span></li>))}</ul></div>
                  {item.evidence.length > 0 ? <div className="mt-3 space-y-1">{item.evidence.slice(0, 2).map((evidence, index) => (<p key={`${item.id}-${index}`} className="rounded-xl bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-500 dark:bg-gray-950 dark:text-gray-400">“{evidence}”</p>))}</div> : null}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Metric({ label, value, detail, tone = "sky" }: { label: string; value: string | number; detail: string; tone?: "sky" | "emerald" | "amber" | "rose" }) {
  const toneClass = tone === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900" : tone === "amber" ? "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900" : tone === "rose" ? "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900" : "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900";
  return <div className={`rounded-2xl p-3 ring-1 ${toneClass}`}><p className="text-[11px] font-semibold opacity-75">{label}</p><p className="mt-1 text-xl font-extrabold">{value}</p><p className="mt-0.5 text-[11px] opacity-75">{detail}</p></div>;
}
