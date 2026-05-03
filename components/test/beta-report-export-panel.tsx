"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, Download, FileJson2, Share2 } from "lucide-react";
import type { BetaFeedbackRecord, BetaMissionId, PilotQaCheck, TranslationFeedbackRecord, UserFeedbackRecord } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

interface MissionReportOption {
  id: BetaMissionId;
  title: string;
}

interface BetaReportExportPanelProps {
  missions: MissionReportOption[];
  records: BetaFeedbackRecord[];
  completedMissionIds: BetaMissionId[];
  qaChecks: PilotQaCheck[];
  completedQaCheckIds: string[];
  modeLabel: string;
  languageLabel: string;
  translationFeedbackRecords?: TranslationFeedbackRecord[];
  userFeedbackRecords?: UserFeedbackRecord[];
}

type ExportStatus = "idle" | "copied" | "downloaded" | "failed";

function missionTitle(missions: MissionReportOption[], missionId: BetaFeedbackRecord["missionId"]) {
  if (missionId === "general") return "General";
  return missions.find((mission) => mission.id === missionId)?.title ?? missionId;
}

function averageRating(records: BetaFeedbackRecord[]) {
  if (records.length === 0) return null;
  const total = records.reduce((sum, record) => sum + record.rating, 0);
  return Number((total / records.length).toFixed(1));
}

function escapeCsvField(value: string | number) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
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

function buildReportPayload({
  missions,
  records,
  completedMissionIds,
  qaChecks,
  completedQaCheckIds,
  modeLabel,
  languageLabel,
  translationFeedbackRecords = [],
  userFeedbackRecords = [],
}: BetaReportExportPanelProps) {
  const requiredChecks = qaChecks.filter((check) => check.required);
  const requiredDone = requiredChecks.filter((check) => completedQaCheckIds.includes(check.id)).length;

  return {
    generatedAt: new Date().toISOString(),
    app: "Landly",
    version: "v54",
    testerContext: {
      mode: modeLabel,
      language: languageLabel,
    },
    pilotReadiness: {
      missionsCompleted: completedMissionIds.length,
      missionTotal: missions.length,
      feedbackNotes: records.length,
      averageClarityScore: averageRating(records),
      requiredQaCompleted: requiredDone,
      requiredQaTotal: requiredChecks.length,
      shareReady: requiredChecks.length > 0 && requiredDone === requiredChecks.length,
    },
    missions: missions.map((mission) => ({
      ...mission,
      completed: completedMissionIds.includes(mission.id),
    })),
    qaChecks: qaChecks.map((check) => ({
      id: check.id,
      category: check.category,
      title: check.title,
      required: check.required,
      completed: completedQaCheckIds.includes(check.id),
    })),
    feedback: records.map((record) => ({
      ...record,
      missionTitle: missionTitle(missions, record.missionId),
    })),
    translationFeedback: translationFeedbackRecords,
    userFeedback: userFeedbackRecords,
  };
}

function buildMarkdownReport(payload: ReturnType<typeof buildReportPayload>) {
  const lines = [
    "# Landly beta report",
    "",
    `Generated: ${payload.generatedAt}`,
    `Mode: ${payload.testerContext.mode}`,
    `Language: ${payload.testerContext.language}`,
    "",
    "## Readiness",
    `- Missions: ${payload.pilotReadiness.missionsCompleted}/${payload.pilotReadiness.missionTotal}`,
    `- Feedback notes: ${payload.pilotReadiness.feedbackNotes}`,
    `- Average clarity score: ${payload.pilotReadiness.averageClarityScore ?? "N/A"}`,
    `- Required QA: ${payload.pilotReadiness.requiredQaCompleted}/${payload.pilotReadiness.requiredQaTotal}`,
    `- Share ready: ${payload.pilotReadiness.shareReady ? "Yes" : "No"}`,
    "",
    "## Feedback notes",
    payload.feedback.length === 0 ? "No feedback notes yet." : payload.feedback.map((record, index) => [
      `${index + 1}. ${record.missionTitle} · ${record.mood} · ${record.rating}/5`,
      `Created: ${record.createdAt}`,
      `Note: ${record.note}`,
    ].join("\n")).join("\n\n"),
    "",
    "## User feedback",
    payload.userFeedback.length === 0 ? "No user feedback yet." : payload.userFeedback.map((record, index) => [
      `${index + 1}. ${record.context} · ${record.category} · ${record.rating}/5`,
      `Path: ${record.path || ""}`,
      `Created: ${record.createdAt}`,
      `Note: ${record.note}`,
    ].join("\n")).join("\n\n"),
    "",
    "## Translation feedback",
    payload.translationFeedback.length === 0 ? "No translation feedback yet." : payload.translationFeedback.map((record, index) => [
      `${index + 1}. ${record.language} · ${record.reason} · ${record.phraseId}`,
      `Created: ${record.createdAt}`,
      `Korean: ${record.korean}`,
      `Displayed: ${record.localizedText}`,
      `Note: ${record.note || ""}`,
    ].join("\n")).join("\n\n"),
    "",
    "## QA checks",
    ...payload.qaChecks.map((check) => `- ${check.completed ? "[x]" : "[ ]"} ${check.title}${check.required ? " (required)" : ""}`),
  ];

  return lines.join("\n");
}

function buildFeedbackCsv(payload: ReturnType<typeof buildReportPayload>) {
  const header = ["mission_id", "mission_title", "mood", "rating", "created_at", "note"];
  const rows = payload.feedback.map((record) => [
    record.missionId,
    record.missionTitle,
    record.mood,
    record.rating,
    record.createdAt,
    record.note,
  ]);

  return [header, ...rows].map((row) => row.map(escapeCsvField).join(",")).join("\n");
}

export function BetaReportExportPanel(props: BetaReportExportPanelProps) {
  const { lt } = useLocalizedText();
  const translationFeedbackRecords = useAppStore((state) => state.translationFeedbackRecords);
  const userFeedbackRecords = useAppStore((state) => state.userFeedbackRecords);
  const [status, setStatus] = useState<ExportStatus>("idle");
  const payload = useMemo(() => buildReportPayload({ ...props, translationFeedbackRecords, userFeedbackRecords }), [props, translationFeedbackRecords, userFeedbackRecords]);
  const markdownReport = useMemo(() => buildMarkdownReport(payload), [payload]);
  const feedbackCsv = useMemo(() => buildFeedbackCsv(payload), [payload]);
  const canExport = props.records.length > 0 || props.completedMissionIds.length > 0 || props.completedQaCheckIds.length > 0 || translationFeedbackRecords.length > 0 || userFeedbackRecords.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownReport);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  const handleDownloadJson = () => {
    downloadTextFile("landly-beta-report-v50.json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    setStatus("downloaded");
  };

  const handleDownloadCsv = () => {
    downloadTextFile("landly-beta-feedback-v50.csv", feedbackCsv, "text/csv;charset=utf-8");
    setStatus("downloaded");
  };

  return (
    <section id="feedback-report" className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-gray-100 p-2 text-gray-700">
          <Share2 size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{lt("Feedback report")}</p>
          <h2 className="mt-1 text-base font-semibold text-gray-950">{lt("Package tester results for sharing")}</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Export a lightweight report from local tester notes. No backend or personal account is required.")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500">{lt("Missions")}</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{payload.pilotReadiness.missionsCompleted}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500">{lt("Notes")}</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{payload.pilotReadiness.feedbackNotes}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500">{lt("QA")}</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{payload.pilotReadiness.requiredQaCompleted}/{payload.pilotReadiness.requiredQaTotal}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canExport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 active:scale-[0.99]"
        >
          <ClipboardCheck size={16} />
          {lt(status === "copied" ? "Report copied" : "Copy markdown report")}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownloadJson}
            disabled={!canExport}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-3 py-3 text-xs font-semibold text-gray-700 disabled:opacity-40 active:scale-[0.99]"
          >
            <FileJson2 size={15} />
            {lt("Download JSON")}
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={props.records.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-3 py-3 text-xs font-semibold text-gray-700 disabled:opacity-40 active:scale-[0.99]"
          >
            <Download size={15} />
            {lt("Download CSV")}
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
        {lt(status === "failed" ? "Copy failed. Use JSON or CSV download instead." : "Reports include mission coverage, QA checklist status, user feedback, local tester notes, and translation feedback.")}
      </div>
    </section>
  );
}
