"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, MessageSquareText, Sparkles } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

interface BetaTestCommandCenterProps {
  completedCount: number;
  feedbackCount: number;
  missionTotal: number;
}

function getProgressWidthClass(value: number) {
  if (value >= 100) return "w-full";
  if (value >= 75) return "w-3/4";
  if (value >= 50) return "w-1/2";
  if (value >= 25) return "w-1/4";
  if (value > 0) return "w-1/6";
  return "w-0";
}

export function BetaTestCommandCenter({ completedCount, feedbackCount, missionTotal }: BetaTestCommandCenterProps) {
  const { lt } = useLocalizedText();
  const progress = missionTotal === 0 ? 0 : Math.round((completedCount / missionTotal) * 100);
  const isPilotReady = completedCount >= 3 && feedbackCount >= 1;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-50 p-2 text-violet-600">
          <Sparkles size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">{lt("Pilot readiness")}</p>
          <h2 className="mt-1 text-base font-semibold text-gray-950">
            {lt(isPilotReady ? "Ready to share with beta testers" : "Complete a few missions first")}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Track completed missions and collect feedback notes before sending the app to a wider test group.")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
            <ClipboardList size={13} />
            {lt("Missions")}
          </div>
          <p className="mt-1 text-xl font-bold text-gray-950">{completedCount}/{missionTotal}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
            <MessageSquareText size={13} />
            {lt("Notes")}
          </div>
          <p className="mt-1 text-xl font-bold text-gray-950">{feedbackCount}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
            <CheckCircle2 size={13} />
            {lt("Status")}
          </div>
          <p className="mt-1 text-sm font-bold text-gray-950">{lt(isPilotReady ? "Pilot ready" : "Draft")}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-700">{lt("Mission coverage")}</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full rounded-full bg-violet-500 transition-all ${getProgressWidthClass(progress)}`} />
        </div>
      </div>

      <Link href="#feedback-notebook" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]">
        {lt("Add feedback note")}
      </Link>
    </section>
  );
}
