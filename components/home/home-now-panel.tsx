"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Sparkles, Zap } from "lucide-react";
import { useSmartActionEngine } from "@/hooks/use-smart-action-engine";
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

export function HomeNowPanel() {
  const { topActions, readinessScore, stats } = useSmartActionEngine();
  const { lt } = useLocalizedText();
  const lead = topActions[0];
  const secondaryActions = topActions.slice(1, 3);
  const LeadIcon = lead?.icon ?? Sparkles;
  const attentionCount = stats.reminderFocus + stats.pendingReceipts + stats.passportMissingReceipts;

  return (
    <section className="px-4 pt-4">
      <div className="rounded-[2rem] border border-blue-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">{lt("Now")}</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">{lt("Do this first")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("One clear next step, then quick backups if your situation changed.")}
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-700 ring-1 ring-blue-100">
            <Zap size={20} />
          </div>
        </div>

        {lead ? (
          <Link
            href={lead.href}
            className="mt-4 block rounded-[1.75rem] bg-gradient-to-br from-gray-950 to-blue-950 p-4 text-white shadow-sm transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start gap-3">
              <div className={cn("shrink-0 rounded-2xl p-3 ring-1", toneClasses[lead.tone])}>
                <LeadIcon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-white/10">
                    {lt(lead.badge)}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/80 ring-1 ring-white/10">
                    {lead.score} · {lt(lead.urgency)}
                  </span>
                </div>
                <p className="mt-3 text-lg font-black leading-snug">{lt(lead.title)}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-blue-50">{lt(lead.description)}</p>
                <p className="mt-3 text-xs font-semibold text-blue-100">{lt("Why")}: {lt(lead.reasons[0])}</p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-blue-100" />
            </div>
          </Link>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-3xl bg-blue-50 p-3 ring-1 ring-blue-100">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-600">{lt("Readiness")}</p>
              <CheckCircle2 size={14} className="text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-gray-950">{readinessScore}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
              <div className={cn("h-full rounded-full bg-blue-600", getReadinessWidthClass(readinessScore))} />
            </div>
          </div>
          <Link href="/my" className="rounded-3xl bg-amber-50 p-3 ring-1 ring-amber-100">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">{lt("Needs attention")}</p>
              <Clock3 size={14} className="text-amber-700" />
            </div>
            <p className="mt-2 text-2xl font-black text-gray-950">{attentionCount}</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-800">{lt("Reminders, receipts, or passport checks.")}</p>
          </Link>
        </div>

        {secondaryActions.length > 0 ? (
          <div className="mt-3 space-y-2">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.id} href={action.href} className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                  <div className={cn("rounded-2xl p-2 ring-1", toneClasses[action.tone])}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-950">{lt(action.title)}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{lt(action.badge)}</p>
                  </div>
                  <ArrowRight size={15} className="shrink-0 text-gray-400" />
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
