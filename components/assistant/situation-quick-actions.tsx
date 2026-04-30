"use client";

import Link from "next/link";
import { ArrowRight, BadgeHelp, Building2, HeartPulse, Languages, ReceiptText, ShieldAlert, CarTaxiFront } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { assistantSituations, AssistantSituation } from "@/data/assistant-situations";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

const toneClass: Record<AssistantSituation["tone"], string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  gray: "border-gray-100 bg-gray-50 text-gray-700",
};

const icons: Record<string, LucideIcon> = {
  "translation-help": Languages,
  "taxi-address": CarTaxiFront,
  "pharmacy-symptoms": HeartPulse,
  "tax-refund-checkout": ReceiptText,
  "lost-passport-item": BadgeHelp,
  "emergency-help": ShieldAlert,
  "government-desk": Building2,
};

export function SituationQuickActions() {
  const { lt } = useLocalizedText();
  const sorted = [...assistantSituations].sort((a, b) => a.priority - b.priority);

  return (
    <section className="space-y-3 px-4 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{lt("Situation mode")}</p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">{lt("What do you need to say?")}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          {lt("Open the right phrase set, copy Korean, or show a large card to staff.")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sorted.map((situation) => {
          const Icon = icons[situation.id] ?? BadgeHelp;

          return (
            <Link
              key={situation.id}
              href={situation.href}
              className="group rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div className={cn("rounded-2xl border p-3", toneClass[situation.tone])}>
                  <Icon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{lt(situation.title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(situation.description)}</p>
                  <p className="mt-2 text-[11px] font-medium text-gray-400">
                    {lt("Includes {count} ready phrases", { count: String(situation.phraseIds.length) })}
                  </p>
                </div>
                <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
