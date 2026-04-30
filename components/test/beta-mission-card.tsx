"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BetaMissionId } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

type MissionTone = "sky" | "emerald" | "rose" | "amber" | "violet" | "gray";

interface BetaMissionCardProps {
  id: BetaMissionId;
  title: string;
  persona: string;
  description: string;
  href: string;
  icon: LucideIcon;
  checkpoints: string[];
  successMetric: string;
  timeBox: string;
  tone: MissionTone;
  completed: boolean;
  highlighted?: boolean;
  onToggleComplete: (id: BetaMissionId) => void;
}

const toneMap: Record<MissionTone, string> = {
  sky: "border-sky-100 bg-sky-50 text-sky-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  gray: "border-gray-100 bg-gray-50 text-gray-700",
};

const iconToneMap: Record<MissionTone, string> = {
  sky: "bg-sky-100 text-sky-600",
  emerald: "bg-emerald-100 text-emerald-600",
  rose: "bg-rose-100 text-rose-600",
  amber: "bg-amber-100 text-amber-600",
  violet: "bg-violet-100 text-violet-600",
  gray: "bg-gray-100 text-gray-600",
};

export function BetaMissionCard({
  id,
  title,
  persona,
  description,
  href,
  icon: Icon,
  checkpoints,
  successMetric,
  timeBox,
  tone,
  completed,
  highlighted = false,
  onToggleComplete,
}: BetaMissionCardProps) {
  const { lt } = useLocalizedText();

  return (
    <article id={`mission-${id}`} className={cn("rounded-3xl border p-4", toneMap[tone], highlighted && "border-gray-900 ring-2 ring-gray-900/10")}>
      <div className="flex items-start gap-3">
        <div className={cn("rounded-2xl p-2.5", iconToneMap[tone])}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{lt(persona)}</p>
            {highlighted ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-gray-800 ring-1 ring-gray-200">
                <Target size={12} />
                {lt("Recommended")}
              </span>
            ) : completed ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 size={12} />
                {lt("Completed")}
              </span>
            ) : null}
          </div>
          <h2 className="mt-1 text-base font-semibold text-gray-950">{lt(title)}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt(description)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl bg-white/75 p-3 text-sm text-gray-700">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Target size={14} />
          {lt("Test checkpoints")}
        </div>
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint} className="flex gap-2 text-xs leading-relaxed">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
            <span>{lt(checkpoint)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-white/75 p-3 text-gray-600">
          <div className="flex items-center gap-1.5 font-semibold text-gray-800"><Clock3 size={13} />{lt("Target time")}</div>
          <p className="mt-1">{lt(timeBox)}</p>
        </div>
        <div className="rounded-2xl bg-white/75 p-3 text-gray-600">
          <p className="font-semibold text-gray-800">{lt("Success signal")}</p>
          <p className="mt-1">{lt(successMetric)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href={href} className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]">
          {lt("Start this test")}
        </Link>
        <button
          type="button"
          aria-pressed={completed}
          onClick={() => onToggleComplete(id)}
          className={cn(
            "inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold active:scale-[0.99]",
            completed ? "border-emerald-200 bg-emerald-600 text-white" : "border-gray-200 bg-white text-gray-800"
          )}
        >
          {lt(completed ? "Mark incomplete" : "Mark tested")}
        </button>
      </div>
    </article>
  );
}
