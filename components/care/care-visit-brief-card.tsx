"use client";

import { ClipboardCheck, Languages } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

interface CareVisitBriefCardProps {
  compact?: boolean;
}

export function CareVisitBriefCard({ compact = false }: CareVisitBriefCardProps) {
  const { lt } = useLocalizedText();
  const { visitPrepNotes, showSnackbar } = useAppStore();
  const latest = visitPrepNotes[0];

  const staffLines = [
    latest?.symptoms ? `증상: ${latest.symptoms}` : "증상: 아직 작성하지 않았습니다.",
    latest?.symptomStart ? `시작 시점: ${latest.symptomStart}` : null,
    latest?.painLevel ? `통증 정도: ${latest.painLevel}` : null,
    latest?.allergies ? `알레르기: ${latest.allergies}` : null,
    latest?.medications ? `복용 중인 약: ${latest.medications}` : null,
    latest?.pregnancyStatus ? `임신 여부: ${latest.pregnancyStatus}` : null,
    latest?.preferredLanguage ? `선호 언어: ${latest.preferredLanguage}` : "선호 언어: English",
    latest?.interpreterNeeded ? "통역 도움이 필요합니다." : null,
  ].filter(Boolean).join("\n");

  const copyBrief = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(staffLines);
      showSnackbar(lt("Visit brief copied."), "success");
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-rose-50 p-2 text-rose-600">
          <ClipboardCheck size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{lt("Clinic visit brief")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Turn your saved prep note into a Korean staff-facing summary before registration or consultation.")}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-gray-50 p-3">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700"><Languages size={14} /> {lt("Show this at reception")}</p>
        <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-900">{staffLines}</pre>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyBrief} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white">
          {lt("Copy visit brief")}
        </button>
        {!compact ? (
          <a href="/care?tab=prep" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
            {lt("Edit prep note")}
          </a>
        ) : null}
      </div>
    </section>
  );
}
