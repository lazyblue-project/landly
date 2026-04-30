"use client";

import Link from "next/link";
import { ArrowRight, GaugeCircle, Sparkles } from "lucide-react";
import { useSmartActionEngine } from "@/hooks/use-smart-action-engine";
import type { SmartActionTone } from "@/data/personal-action-rules";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

const toneClasses: Record<SmartActionTone, string> = {
  sky: "border-sky-100 bg-sky-50 text-sky-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  slate: "border-slate-100 bg-slate-50 text-slate-700",
};

function getReadinessWidthClass(value: number) {
  if (value >= 90) return "w-11/12";
  if (value >= 80) return "w-4/5";
  if (value >= 70) return "w-3/4";
  if (value >= 60) return "w-3/5";
  if (value >= 50) return "w-1/2";
  if (value >= 40) return "w-2/5";
  if (value >= 25) return "w-1/4";
  return "w-1/6";
}

export function SmartActionBrief() {
  const { topActions, readinessScore, stats } = useSmartActionEngine();
  const { lt } = useLocalizedText();
  const lead = topActions[0];

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-100">
              <Sparkles size={13} />
              {lt("Smart action engine")}
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-900">{lt("Landly picked your next best step")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {lt("Ranked from your onboarding priority, saved items, reminders, receipts, stay plan, and departure setup.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-blue-600 shadow-sm">
            <GaugeCircle size={20} />
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-white bg-white/80 p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">{lt("Readiness score")}</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{readinessScore}</p>
            </div>
            {lead ? (
              <Link href={lead.href} className="rounded-2xl bg-gray-900 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-gray-800">
                {lt(lead.badge)}
              </Link>
            ) : null}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className={cn("h-full rounded-full bg-blue-600", getReadinessWidthClass(readinessScore))} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Reminders")}</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{stats.reminderFocus}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Receipts")}</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{stats.pendingReceipts}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Saved")}</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{stats.savedEssentialCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {topActions.slice(0, 3).map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.id} href={action.href} className="flex items-center gap-3 rounded-3xl border border-white bg-white/90 p-3 shadow-sm transition-colors hover:bg-white">
                <div className={cn("shrink-0 rounded-2xl border p-2", toneClasses[action.tone])}>
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">#{index + 1}</span>
                    <span className="truncate text-[11px] font-bold text-blue-700">{action.score} · {lt(action.urgency)}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-gray-900">{lt(action.title)}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{lt(action.reasons[0])}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-gray-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
