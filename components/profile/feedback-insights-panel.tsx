"use client";

import { useMemo, useState } from "react";
import { Download, MessageSquareText, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import type { UserFeedbackCategory, UserFeedbackRecord } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

const categoryLabels: Record<UserFeedbackCategory, string> = {
  useful: "Useful",
  confusing: "Confusing",
  missing: "Missing",
  bug: "Bug",
  idea: "Idea",
};

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function averageRating(records: UserFeedbackRecord[]) {
  if (records.length === 0) return null;
  const total = records.reduce((sum, record) => sum + record.rating, 0);
  return Number((total / records.length).toFixed(1));
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function FeedbackInsightsPanel() {
  const { lt } = useLocalizedText();
  const records = useAppStore((state) => state.userFeedbackRecords);
  const removeUserFeedbackRecord = useAppStore((state) => state.removeUserFeedbackRecord);
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const [showAll, setShowAll] = useState(false);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [records]
  );

  const categoryCounts = useMemo(() => {
    return sortedRecords.reduce<Record<UserFeedbackCategory, number>>(
      (acc, record) => {
        acc[record.category] += 1;
        return acc;
      },
      { useful: 0, confusing: 0, missing: 0, bug: 0, idea: 0 }
    );
  }, [sortedRecords]);

  const visibleRecords = showAll ? sortedRecords : sortedRecords.slice(0, 3);
  const avg = averageRating(sortedRecords);

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: "v52",
      schema: "landly-user-feedback",
      records: sortedRecords,
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadTextFile(`landly-user-feedback-${date}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    showSnackbar(lt("Feedback report downloaded"), "success");
  };

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-violet-50 p-2 text-violet-700 ring-1 ring-violet-100">
            <MessageSquareText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">{lt("Feedback loop")}</p>
            <h2 className="mt-1 text-base font-bold text-gray-950">{lt("User feedback captured locally")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {lt("Review page-level notes before exporting a beta report or deciding the next product patch.")}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] font-semibold text-gray-500">{lt("Notes")}</p>
            <p className="mt-1 text-xl font-bold text-gray-950">{records.length}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] font-semibold text-gray-500">{lt("Avg score")}</p>
            <p className="mt-1 text-xl font-bold text-gray-950">{avg ?? "—"}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] font-semibold text-gray-500">{lt("Confusing")}</p>
            <p className="mt-1 text-xl font-bold text-gray-950">{categoryCounts.confusing}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(categoryCounts) as UserFeedbackCategory[]).map((category) => (
            <span key={category} className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100">
              {lt(categoryLabels[category])}: {categoryCounts[category]}
            </span>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {visibleRecords.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
              {lt("No user feedback notes yet. Use the feedback card at the bottom of each page to capture the first confusing moment.")}
            </div>
          ) : (
            visibleRecords.map((record) => (
              <article key={record.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{lt(record.context)} · {lt(categoryLabels[record.category])}</p>
                    <p className="mt-1 text-[11px] text-gray-500">{formatDate(record.createdAt)} · {record.rating}/5 · {record.path ?? "/"}</p>
                  </div>
                  <button type="button" onClick={() => removeUserFeedbackRecord(record.id)} className="rounded-xl p-2 text-gray-400 active:scale-[0.98]" aria-label={lt("Remove feedback note")}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{record.note}</p>
              </article>
            ))
          )}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={records.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-40 active:scale-[0.99]"
          >
            <Download size={16} />
            {lt("Export feedback JSON")}
          </button>
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            disabled={records.length <= 3}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 disabled:opacity-40 active:scale-[0.99]"
          >
            {lt(showAll ? "Show less" : "Show all feedback")}
          </button>
        </div>
      </div>
    </section>
  );
}
