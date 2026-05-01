"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Activity, AlertTriangle, CheckCircle2, ClipboardCheck, Download, ExternalLink, Rocket, ShieldCheck } from "lucide-react";
import { betaLaunchChecklist } from "@/data/beta-launch-checklist";
import { LANDLY_RELEASE_DATE, LANDLY_RELEASE_NAME, LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";
import { isFeedbackApiEnabled, isPartnerOffersEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";
import type { LaunchChecklistCategory, LaunchChecklistItem } from "@/types";

type ComputedStatus = "ready" | "watch" | "todo";
type StoreSnapshot = ReturnType<typeof useAppStore.getState>;

const categoryLabels: Record<LaunchChecklistCategory, string> = {
  setup: "Setup",
  journey: "Journey",
  safety: "Safety",
  feedback: "Feedback",
  operations: "Operations",
  handoff: "Handoff",
};

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

function statusTone(status: ComputedStatus) {
  if (status === "ready") return "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300";
  if (status === "watch") return "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";
  return "border-gray-100 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

function computeChecklistStatus(item: LaunchChecklistItem, state: StoreSnapshot): ComputedStatus {
  switch (item.id) {
    case "onboarding-smoke":
      return state.user.onboardingCompleted ? "ready" : "todo";
    case "travel-journey":
      return state.savedPassPlans.length + state.user.savedPlaceIds.length + state.user.savedPhraseIds.length > 0 ? "ready" : "watch";
    case "life-journey":
      return state.savedStayResourceIds.length + state.completedStayMissionIds.length + state.user.completedChecklistIds.length > 0 ? "ready" : "watch";
    case "sos-offline":
      return "ready";
    case "feedback-capture":
      return state.userFeedbackRecords.length > 0 ? "ready" : "todo";
    case "translation-qa":
      return state.translationFeedbackRecords.length > 0 ? "ready" : "watch";
    case "backup-export":
      return state.calendarEvents.length + state.manualReminderItems.length > 0 ? "ready" : "watch";
    case "health-smoke":
    case "operator-snapshot":
      return "watch";
    default:
      return item.required ? "todo" : "watch";
  }
}

export function BetaLaunchControlRoom() {
  const { lt } = useLocalizedText();
  const state = useAppStore();
  const showSnackbar = useAppStore((store) => store.showSnackbar);

  const computedItems = useMemo(() => {
    return betaLaunchChecklist.map((item) => ({ ...item, status: computeChecklistStatus(item, state) }));
  }, [state]);

  const requiredItems = computedItems.filter((item) => item.required);
  const requiredReady = requiredItems.filter((item) => item.status === "ready").length;
  const watchCount = computedItems.filter((item) => item.status === "watch").length;
  const todoCount = computedItems.filter((item) => item.status === "todo").length;
  const readinessScore = requiredItems.length > 0 ? Math.round((requiredReady / requiredItems.length) * 100) : 100;

  const autoSignals = [
    { label: "Release", value: `${LANDLY_RELEASE_VERSION} · ${LANDLY_RELEASE_NAME}`, status: "ready" as const },
    { label: "Onboarding", value: state.user.onboardingCompleted ? "completed" : "not completed", status: state.user.onboardingCompleted ? "ready" as const : "todo" as const },
    { label: "User feedback", value: `${state.userFeedbackRecords.length} notes`, status: state.userFeedbackRecords.length > 0 ? "ready" as const : "todo" as const },
    { label: "Translation QA", value: `${state.translationFeedbackRecords.length} reports`, status: state.translationFeedbackRecords.length > 0 ? "watch" as const : "ready" as const },
    { label: "Feedback API", value: isFeedbackApiEnabled() ? "enabled" : "local only", status: isFeedbackApiEnabled() ? "watch" as const : "ready" as const },
    { label: "Partner offers", value: isPartnerOffersEnabled(state.isBetaTester) ? "visible" : "guarded", status: isPartnerOffersEnabled(state.isBetaTester) ? "watch" as const : "ready" as const },
  ];

  const grouped = computedItems.reduce<Partial<Record<LaunchChecklistCategory, typeof computedItems>>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category]?.push(item);
    return acc;
  }, {});

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: "v52",
      schema: "landly-beta-launch-report",
      release: {
        version: LANDLY_RELEASE_VERSION,
        name: LANDLY_RELEASE_NAME,
        date: LANDLY_RELEASE_DATE,
      },
      readiness: {
        score: readinessScore,
        requiredReady,
        requiredTotal: requiredItems.length,
        watchCount,
        todoCount,
      },
      profile: {
        language: state.user.language,
        mode: state.user.mode,
        city: state.user.city,
        onboardingCompleted: state.user.onboardingCompleted,
        isBetaTester: state.isBetaTester,
      },
      metrics: {
        savedPlaces: state.user.savedPlaceIds.length,
        savedPhrases: state.user.savedPhraseIds.length,
        savedPassPlans: state.savedPassPlans.length,
        savedCareProviders: state.savedCareProviderIds.length,
        savedStayResources: state.savedStayResourceIds.length,
        calendarEvents: state.calendarEvents.length,
        reminders: state.manualReminderItems.length,
        userFeedbackRecords: state.userFeedbackRecords.length,
        translationFeedbackRecords: state.translationFeedbackRecords.length,
      },
      checklist: computedItems,
      recentFeedback: state.userFeedbackRecords.slice(0, 12),
      translationFeedback: state.translationFeedbackRecords.slice(0, 24),
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`landly-beta-launch-report-${date}.json`, payload);
    showSnackbar(lt("Beta launch report downloaded"), "success");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm dark:border-sky-900 dark:from-sky-950/30 dark:to-gray-950">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-sky-600 p-2 text-white">
            <Rocket size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{lt("Beta launch control")}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-gray-50">{LANDLY_RELEASE_VERSION} · {lt(LANDLY_RELEASE_NAME)}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {lt("Use this screen before a tester round or Vercel share link. It turns local usage signals into a launch checklist and exportable report.")}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Metric label="Score" value={`${readinessScore}%`} detail={`${requiredReady}/${requiredItems.length} required`} tone={readinessScore >= 80 ? "emerald" : "amber"} />
          <Metric label="Watch" value={watchCount} detail="manual checks" tone={watchCount > 0 ? "amber" : "emerald"} />
          <Metric label="Todo" value={todoCount} detail="missing signals" tone={todoCount > 0 ? "rose" : "emerald"} />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99] dark:bg-white dark:text-gray-950"
          >
            <Download size={16} />
            {lt("Export launch report")}
          </button>
          <Link
            href="/api/health"
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 active:scale-[0.99] dark:border-gray-700 dark:text-gray-100"
          >
            <Activity size={16} />
            {lt("Open health API")}
            <ExternalLink size={13} />
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt("Automatic launch signals")}</h3>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {autoSignals.map((signal) => (
            <div key={signal.label} className={`rounded-2xl border px-3 py-2 text-xs ${statusTone(signal.status)}`}>
              <p className="font-bold">{lt(signal.label)}</p>
              <p className="mt-0.5 opacity-80">{lt(signal.value)}</p>
            </div>
          ))}
        </div>
      </section>

      {(Object.keys(grouped) as LaunchChecklistCategory[]).map((category) => (
        <section key={category} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-sky-600" />
            <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt(categoryLabels[category])}</h3>
          </div>
          <div className="mt-3 space-y-2">
            {(grouped[category] ?? []).map((item) => (
              <article key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt(item.title)}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{lt(item.description)}</p>
                    <p className="mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      {lt("Success")}: {lt(item.successSignal)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusTone(item.status)}`}>
                    {item.status === "ready" ? <CheckCircle2 size={12} className="mr-1 inline" /> : item.status === "watch" ? <AlertTriangle size={12} className="mr-1 inline" /> : null}
                    {lt(item.status)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{lt("Owner")}: {lt(item.owner)}</span>
                  {item.href ? (
                    <Link href={item.href} className="font-bold text-sky-700 dark:text-sky-300">
                      {lt("Open")} →
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
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
