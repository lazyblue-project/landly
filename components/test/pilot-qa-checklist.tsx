"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardCheck, ExternalLink, ShieldCheck } from "lucide-react";
import type { PilotQaCheck } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface PilotQaChecklistProps {
  checks: PilotQaCheck[];
  completedIds: string[];
  onToggle: (id: string) => void;
}

const categoryLabel: Record<PilotQaCheck["category"], string> = {
  setup: "Setup",
  offline: "Offline",
  journey: "Journey",
  trust: "Trust",
  commercial: "Commercial",
  handoff: "Handoff",
};

function getProgressWidthClass(value: number) {
  if (value >= 100) return "w-full";
  if (value >= 80) return "w-4/5";
  if (value >= 60) return "w-3/5";
  if (value >= 40) return "w-2/5";
  if (value >= 20) return "w-1/5";
  if (value > 0) return "w-1/12";
  return "w-0";
}

export function PilotQaChecklist({ checks, completedIds, onToggle }: PilotQaChecklistProps) {
  const { lt } = useLocalizedText();
  const requiredChecks = checks.filter((check) => check.required);
  const requiredDone = requiredChecks.filter((check) => completedIds.includes(check.id)).length;
  const totalDone = checks.filter((check) => completedIds.includes(check.id)).length;
  const progress = checks.length === 0 ? 0 : Math.round((totalDone / checks.length) * 100);
  const requiredReady = requiredChecks.length > 0 && requiredDone === requiredChecks.length;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
          <ShieldCheck size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{lt("Pre-share QA")}</p>
          <h2 className="mt-1 text-base font-semibold text-gray-950">
            {lt(requiredReady ? "Required checks are ready" : "Finish required checks before sharing")}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Use this checklist before sending a Vercel link to external testers or partners.")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500">{lt("Required")}</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{requiredDone}/{requiredChecks.length}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500">{lt("Total")}</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{totalDone}/{checks.length}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500">{lt("Share status")}</p>
          <p className="mt-1 text-sm font-bold text-gray-950">{lt(requiredReady ? "Share ready" : "Hold")}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-700">{lt("QA coverage")}</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full rounded-full bg-blue-500 transition-all ${getProgressWidthClass(progress)}`} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {checks.map((check) => {
          const completed = completedIds.includes(check.id);
          return (
            <article key={check.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggle(check.id)}
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border active:scale-[0.98]",
                    completed ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-gray-400"
                  )}
                  aria-pressed={completed}
                  aria-label={lt(completed ? "Mark QA check incomplete" : "Mark QA check complete")}
                >
                  <CheckCircle2 size={18} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500 ring-1 ring-gray-100">
                      {lt(categoryLabel[check.category])}
                    </span>
                    {check.required ? (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        {lt("Required")}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-gray-950">{lt(check.title)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(check.description)}</p>
                  {check.href ? (
                    <Link href={check.href} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                      <ClipboardCheck size={13} />
                      {lt("Open check flow")}
                      <ExternalLink size={12} />
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
