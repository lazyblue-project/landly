"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  FileJson,
  Languages,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Rocket,
  GitPullRequestArrow,
} from "lucide-react";
import { LANDLY_CORE_ROUTES, LANDLY_RELEASE_NAME, LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";
import { isFeedbackApiEnabled, isPartnerOffersEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";
import type { Language, UserFeedbackCategory, UserFeedbackRecord } from "@/types";

const feedbackCategoryLabels: Record<UserFeedbackCategory, string> = {
  useful: "Useful",
  confusing: "Confusing",
  missing: "Missing",
  bug: "Bug",
  idea: "Idea",
};

const languageLabels: Record<Language, string> = {
  en: "English",
  ko: "한국어",
  zh: "中文",
  ja: "日本語",
  es: "Español",
  fr: "Français",
};

function averageRating(records: UserFeedbackRecord[]) {
  if (records.length === 0) return null;
  const total = records.reduce((sum, record) => sum + record.rating, 0);
  return Number((total / records.length).toFixed(1));
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

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

export function OperatorInsightsDashboard() {
  const { lt } = useLocalizedText();
  const state = useAppStore();
  const showSnackbar = useAppStore((store) => store.showSnackbar);

  const feedbackRecords = useMemo(
    () => [...state.userFeedbackRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.userFeedbackRecords]
  );

  const feedbackCategoryCounts = useMemo(() => {
    return feedbackRecords.reduce<Record<UserFeedbackCategory, number>>(
      (acc, record) => {
        acc[record.category] += 1;
        return acc;
      },
      { useful: 0, confusing: 0, missing: 0, bug: 0, idea: 0 }
    );
  }, [feedbackRecords]);

  const translationLanguageCounts = useMemo(() => {
    return state.translationFeedbackRecords.reduce<Partial<Record<Language, number>>>((acc, record) => {
      acc[record.language] = (acc[record.language] ?? 0) + 1;
      return acc;
    }, {});
  }, [state.translationFeedbackRecords]);

  const avgFeedback = averageRating(feedbackRecords);
  const riskSignalCount = feedbackCategoryCounts.confusing + feedbackCategoryCounts.missing + feedbackCategoryCounts.bug;
  const savedItemCount =
    state.user.savedPlaceIds.length +
    state.user.savedPhraseIds.length +
    state.savedShopStoreIds.length +
    state.savedCareProviderIds.length +
    state.savedStayResourceIds.length +
    state.savedPassPlans.length;
  const scheduleCount = state.calendarEvents.length + state.manualReminderItems.length;
  const testerProgressCount = state.completedBetaMissionIds.length + state.completedPilotQaCheckIds.length;

  const topContexts = useMemo(() => {
    const counts = feedbackRecords.reduce<Record<string, number>>((acc, record) => {
      const key = record.context || record.path || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [feedbackRecords]);

  const readinessItems = [
    {
      id: "feedback",
      label: "Feedback loop",
      status: state.userFeedbackRecords.length > 0 ? "watch" : "ready",
      detail:
        state.userFeedbackRecords.length > 0
          ? "Review confusing, missing, and bug notes before the next patch."
          : "Feedback capture is ready; no local tester notes have been saved yet.",
    },
    {
      id: "translation",
      label: "Translation QA",
      status: state.translationFeedbackRecords.length > 0 ? "watch" : "ready",
      detail:
        state.translationFeedbackRecords.length > 0
          ? "Translation issue reports exist and should be triaged by language."
          : "No translation issue reports are currently saved on this device.",
    },
    {
      id: "feedback-api",
      label: "Feedback API",
      status: isFeedbackApiEnabled() ? "watch" : "guarded",
      detail: isFeedbackApiEnabled()
        ? "Feedback API flag is enabled. Confirm webhook/database handling before production use."
        : "Feedback API is guarded; local capture and export remain the default.",
    },
    {
      id: "partners",
      label: "Partner offers",
      status: isPartnerOffersEnabled(state.isBetaTester) ? "watch" : "guarded",
      detail: isPartnerOffersEnabled(state.isBetaTester)
        ? "Partner offers can appear for this tester; confirm disclosures and mock labels."
        : "Partner offers are hidden unless the beta/user flag enables them.",
    },
  ] as const;

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: "v53",
      schema: "landly-operator-snapshot",
      release: {
        version: LANDLY_RELEASE_VERSION,
        name: LANDLY_RELEASE_NAME,
        coreRouteCount: LANDLY_CORE_ROUTES.length,
      },
      profile: {
        language: state.user.language,
        mode: state.user.mode,
        city: state.user.city,
        onboardingCompleted: state.user.onboardingCompleted,
        isBetaTester: state.isBetaTester,
      },
      metrics: {
        userFeedbackCount: state.userFeedbackRecords.length,
        averageFeedbackRating: avgFeedback,
        riskSignalCount,
        translationFeedbackCount: state.translationFeedbackRecords.length,
        savedItemCount,
        scheduleCount,
        testerProgressCount,
      },
      feedbackCategoryCounts,
      translationLanguageCounts,
      topContexts,
      recentFeedback: feedbackRecords.slice(0, 12),
      translationFeedback: state.translationFeedbackRecords.slice(0, 24),
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`landly-operator-snapshot-${date}.json`, payload);
    showSnackbar(lt("Operator snapshot downloaded"), "success");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-900">
            <BarChart3 size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{lt("Operator insights")}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-gray-50">
              {LANDLY_RELEASE_VERSION} · {lt(LANDLY_RELEASE_NAME)}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {lt("Review local beta signals, translation issues, saved-item activity, and guarded feature status before deciding the next patch.")}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetricCard label="Feedback" value={state.userFeedbackRecords.length} detail={avgFeedback ? `Avg ${avgFeedback}/5` : "No score yet"} />
          <MetricCard label="Risk signals" value={riskSignalCount} detail="Confusing + missing + bug" tone={riskSignalCount > 0 ? "amber" : "emerald"} />
          <MetricCard label="Translation QA" value={state.translationFeedbackRecords.length} detail="Phrase reports" />
          <MetricCard label="Saved items" value={savedItemCount} detail="Places, phrases, plans" />
          <MetricCard label="Schedules" value={scheduleCount} detail="Calendar + reminders" />
          <MetricCard label="Tester progress" value={testerProgressCount} detail="Missions + QA checks" />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99] dark:bg-white dark:text-gray-950"
          >
            <Download size={16} />
            {lt("Export operator snapshot")}
          </button>
          <Link
            href="/api/health"
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 active:scale-[0.99] dark:border-gray-700 dark:text-gray-100"
          >
            <Activity size={16} />
            {lt("Open health API")}
          </Link>
          <Link href="/launch" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 px-4 py-3 text-sm font-bold text-sky-800 active:scale-[0.99] dark:border-sky-800 dark:text-sky-200">
            <Rocket size={16} />
            {lt("Open launch checklist")}
          </Link>
          <Link href="/triage" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 px-4 py-3 text-sm font-bold text-indigo-800 active:scale-[0.99] dark:border-indigo-800 dark:text-indigo-200">
            <GitPullRequestArrow size={16} />
            {lt("Open triage board")}
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt("Operational readiness")}</h3>
        </div>
        <div className="mt-3 space-y-2">
          {readinessItems.map((item) => (
            <div key={item.id} className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex items-start gap-3">
                <div className={`rounded-2xl p-2 ${item.status === "ready" ? "bg-emerald-100 text-emerald-700" : item.status === "guarded" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>
                  {item.status === "ready" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{lt(item.label)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{lt(item.detail)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <MessageSquareText size={18} className="text-violet-600" />
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt("Feedback triage")}</h3>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(feedbackCategoryCounts) as UserFeedbackCategory[]).map((category) => (
            <span key={category} className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
              {lt(feedbackCategoryLabels[category])}: {feedbackCategoryCounts[category]}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {feedbackRecords.slice(0, 4).length === 0 ? (
            <EmptyInsight text="No page-level tester feedback is saved on this device yet." />
          ) : (
            feedbackRecords.slice(0, 4).map((record) => (
              <article key={record.id} className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {lt(record.context)} · {lt(feedbackCategoryLabels[record.category])} · {record.rating}/5
                </p>
                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{formatDate(record.createdAt)} · {record.path ?? "/"}</p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{record.note}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Languages size={18} className="text-sky-600" />
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">{lt("Translation QA by language")}</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(languageLabels) as Language[]).map((language) => (
            <div key={language} className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{languageLabels[language]}</p>
              <p className="mt-1 text-xl font-black text-gray-950 dark:text-gray-50">{translationLanguageCounts[language] ?? 0}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-4 shadow-sm dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="mt-0.5 text-blue-700 dark:text-blue-300" />
          <div>
            <p className="text-sm font-bold text-blue-950 dark:text-blue-100">{lt("Suggested next patch decision")}</p>
            <p className="mt-1 text-xs leading-relaxed text-blue-800 dark:text-blue-200">
              {lt(
                riskSignalCount > 0
                  ? "Prioritize the pages with confusing, missing, or bug reports before adding new live-data features."
                  : state.translationFeedbackRecords.length > 0
                    ? "Prioritize translation cleanup for reported languages, then continue API pilot work."
                    : "No blocking local beta signals are saved yet. Continue with a small live-data pilot or recruit more testers."
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, detail, tone = "slate" }: { label: string; value: number; detail: string; tone?: "slate" | "amber" | "emerald" }) {
  const { lt } = useLocalizedText();
  const toneClass = tone === "amber" ? "text-amber-700" : tone === "emerald" ? "text-emerald-700" : "text-gray-950 dark:text-gray-50";
  return (
    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
      <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{lt(label)}</p>
      <p className={`mt-1 text-2xl font-black ${toneClass}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{lt(detail)}</p>
    </div>
  );
}

function EmptyInsight({ text }: { text: string }) {
  const { lt } = useLocalizedText();
  return (
    <div className="rounded-2xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      <FileJson className="mb-2" size={16} />
      {lt(text)}
    </div>
  );
}
