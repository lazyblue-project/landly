"use client";

import { Activity, CheckCircle2, ClipboardCheck, ShieldAlert } from "lucide-react";
import { releaseReadiness } from "@/data/release-readiness";
import { useLocalizedText } from "@/lib/text-localizer";

const statusStyle = {
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  guarded: "bg-amber-50 text-amber-700 ring-amber-100",
  watch: "bg-sky-50 text-sky-700 ring-sky-100",
} as const;

const statusLabel = {
  ready: "Ready",
  guarded: "Guarded",
  watch: "Watch",
} as const;

export function ReleaseReadinessPanel() {
  const { lt } = useLocalizedText();

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 ring-1 ring-emerald-100">
          <ClipboardCheck size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {lt("Release readiness")}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-950">
            {releaseReadiness.version} · {lt(releaseReadiness.name)}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">{lt(releaseReadiness.summary)}</p>
          <p className="mt-2 text-[11px] font-semibold text-gray-400">
            {lt("Release date")} · {releaseReadiness.date}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {releaseReadiness.checks.map((check) => {
          const Icon = check.status === "guarded" ? ShieldAlert : CheckCircle2;
          return (
            <div key={check.id} className="rounded-2xl bg-gray-50 p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-2 text-emerald-700 shadow-sm">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-950">{lt(check.label)}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${statusStyle[check.status]}`}>
                      {lt(statusLabel[check.status])}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(check.detail)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800 ring-1 ring-emerald-100">
        <div className="mb-2 flex items-center gap-2 font-bold">
          <Activity size={14} />
          {lt("Operator checklist")}
        </div>
        <ul className="space-y-1.5">
          {releaseReadiness.nextSteps.map((step) => (
            <li key={step} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{lt(step)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
