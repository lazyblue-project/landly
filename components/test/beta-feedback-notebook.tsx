"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ClipboardCheck, MessageSquareText, Trash2 } from "lucide-react";
import type { BetaFeedbackMood, BetaFeedbackRecord, BetaMissionId } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface MissionOption {
  id: BetaMissionId;
  title: string;
}

interface BetaFeedbackNotebookProps {
  missions: MissionOption[];
  records: BetaFeedbackRecord[];
  onAdd: (record: BetaFeedbackRecord) => void;
  onRemove: (id: string) => void;
  defaultMissionId?: BetaFeedbackRecord["missionId"];
}

const moodOptions: { id: BetaFeedbackMood; label: string }[] = [
  { id: "worked", label: "Worked well" },
  { id: "confusing", label: "Confusing" },
  { id: "missing", label: "Missing" },
  { id: "idea", label: "Idea" },
];

const ratingOptions: BetaFeedbackRecord["rating"][] = [1, 2, 3, 4, 5];

function formatRecordDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildFeedbackSummary(records: BetaFeedbackRecord[], missions: MissionOption[]) {
  const missionTitle = (missionId: BetaFeedbackRecord["missionId"]) =>
    missionId === "general" ? "General" : missions.find((mission) => mission.id === missionId)?.title ?? missionId;

  const lines = [
    "Landly beta feedback notes",
    "",
    `Total notes: ${records.length}`,
    "",
    ...records.map((record, index) => [
      `${index + 1}. ${missionTitle(record.missionId)} · ${record.mood} · ${record.rating}/5`,
      `Created: ${record.createdAt}`,
      `Note: ${record.note}`,
    ].join("\n")),
  ];

  return lines.join("\n\n");
}

export function BetaFeedbackNotebook({ missions, records, onAdd, onRemove, defaultMissionId = "general" }: BetaFeedbackNotebookProps) {
  const { lt } = useLocalizedText();
  const [missionId, setMissionId] = useState<BetaFeedbackRecord["missionId"]>(defaultMissionId);
  const [mood, setMood] = useState<BetaFeedbackMood>("confusing");
  const [rating, setRating] = useState<BetaFeedbackRecord["rating"]>(3);
  const [note, setNote] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [records]
  );

  useEffect(() => {
    setMissionId(defaultMissionId);
  }, [defaultMissionId]);

  const missionTitle = (value: BetaFeedbackRecord["missionId"]) =>
    value === "general" ? lt("General") : lt(missions.find((mission) => mission.id === value)?.title ?? value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;

    onAdd({
      id: `beta_feedback_${Date.now()}`,
      missionId,
      mood,
      rating,
      note: trimmed,
      createdAt: new Date().toISOString(),
    });
    setNote("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildFeedbackSummary(sortedRecords, missions));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section id="feedback-notebook" className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
          <MessageSquareText size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{lt("Feedback notebook")}</p>
          <h2 className="mt-1 text-base font-semibold text-gray-950">{lt("Capture the first confusing moment")}</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Notes stay on this device only. Copy the report when you are ready to share it.")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">{lt("Mission")}</span>
          <select
            value={missionId}
            onChange={(event) => setMissionId(event.target.value as BetaFeedbackRecord["missionId"])}
            className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-400"
          >
            <option value="general">{lt("General")}</option>
            {missions.map((mission) => (
              <option key={mission.id} value={mission.id}>{lt(mission.title)}</option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-xs font-semibold text-gray-700">{lt("Feedback type")}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMood(option.id)}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-xs font-semibold active:scale-[0.99]",
                  mood === option.id ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700"
                )}
              >
                {lt(option.label)}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-gray-700">{lt("Clarity score")}</span>
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value) as BetaFeedbackRecord["rating"])}
            className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-400"
          >
            {ratingOptions.map((value) => (
              <option key={value} value={value}>{value}/5</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-gray-700">{lt("Tester note")}</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            placeholder={lt("Example: I could not find the next step after opening the refund page.")}
            className="mt-1 w-full resize-none rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-400"
          />
        </label>

        <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]">
          {lt("Save feedback note")}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-900">{lt("Saved notes")}: {records.length}</p>
        <button
          type="button"
          onClick={handleCopy}
          disabled={records.length === 0}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 disabled:opacity-40"
        >
          <ClipboardCheck size={14} />
          {lt(copyState === "copied" ? "Report copied" : copyState === "failed" ? "Copy failed" : "Copy report")}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {sortedRecords.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
            {lt("No feedback notes yet. Run one mission, then write the first confusing or helpful moment.")}
          </div>
        ) : (
          sortedRecords.map((record) => (
            <article key={record.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-900">{missionTitle(record.missionId)} · {lt(record.mood)}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{formatRecordDate(record.createdAt)} · {record.rating}/5</p>
                </div>
                <button type="button" onClick={() => onRemove(record.id)} className="rounded-xl p-2 text-gray-400 active:scale-[0.98]" aria-label={lt("Remove feedback note")}>
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{record.note}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
