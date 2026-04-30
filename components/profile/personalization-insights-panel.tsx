"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useSmartActionEngine } from "@/hooks/use-smart-action-engine";
import { useAppStore } from "@/store/app-store";
import type { SmartActionTone } from "@/data/personal-action-rules";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

const toneClasses: Record<SmartActionTone, string> = {
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  slate: "bg-slate-50 text-slate-700 ring-slate-100",
};

export function PersonalizationInsightsPanel() {
  const { user, departureDate, stayPlanInput } = useAppStore();
  const { actions, readinessScore, stats } = useSmartActionEngine();
  const { lt } = useLocalizedText();
  const focusActions = actions.slice(0, 5);

  const signals = [
    { label: "Mode", value: user.mode === "life" ? "Life Mode" : "Travel Mode" },
    { label: "First need", value: user.firstNeed ?? "Not selected" },
    { label: "Stay length", value: user.stayDuration },
    { label: "Departure", value: departureDate ?? "Not set" },
    { label: "Stay plan", value: stayPlanInput ? "Created" : "Not created" },
    { label: "Attention", value: String(stats.reminderFocus) },
  ];

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700 ring-1 ring-violet-100">
              <BrainCircuit size={13} />
              {lt("Personalization profile")}
            </div>
            <h2 className="mt-3 text-base font-bold text-gray-900">{lt("Why Landly recommends these actions")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("This panel explains which profile signals and saved items are shaping your next actions.")}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Score")}</p>
            <p className="text-lg font-black text-gray-900">{readinessScore}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {signals.map((signal) => (
            <div key={signal.label} className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt(signal.label)}</p>
              <p className="mt-1 truncate text-xs font-bold text-gray-800">{lt(signal.value)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {focusActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.id} href={action.href} className="block rounded-3xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={cn("mt-0.5 rounded-2xl p-2 ring-1", toneClasses[action.tone])}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600">{action.score}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500">{lt(action.badge)}</span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-gray-900">{lt(action.title)}</p>
                      <div className="mt-2 space-y-1">
                        {action.reasons.slice(0, 2).map((reason) => (
                          <div key={reason} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-500">
                            <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                            <span>{lt(reason)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={15} className="mt-1 shrink-0 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
