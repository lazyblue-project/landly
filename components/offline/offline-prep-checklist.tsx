"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, ClipboardCheck } from "lucide-react";
import { offlinePrepSteps, type OfflinePrepStep } from "@/data/offline-safety-kit";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

function isStepDone(step: OfflinePrepStep, state: ReturnType<typeof useAppStore.getState>) {
  switch (step.signal) {
    case "phrases":
      return state.user.savedPhraseIds.length >= 3;
    case "route":
      return state.savedPassPlans.length > 0;
    case "receipts":
      return state.receiptRecords.length > 0;
    case "care":
      return state.visitPrepNotes.length > 0 || state.savedCareProviderIds.length > 0;
    case "documents":
      return state.stayDocuments.length > 0;
    case "departure":
      return Boolean(state.departureDate);
    case "trust":
      return true;
    default:
      return false;
  }
}

export function OfflinePrepChecklist() {
  const state = useAppStore();
  const { lt } = useLocalizedText();
  const visibleSteps = offlinePrepSteps.filter((step) => step.requiredFor.includes(state.user.mode));
  const completedCount = visibleSteps.filter((step) => isStepDone(step, state)).length;

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
            <ClipboardCheck size={19} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-gray-900">{lt("Before you rely on Landly offline")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {lt("Use this as a pre-flight checklist. Landly is still a PWA, so save critical info before you lose signal.")}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lt("Done")}</p>
            <p className="mt-1 text-sm font-black text-gray-900">{completedCount}/{visibleSteps.length}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {visibleSteps.map((step) => {
            const done = isStepDone(step, state);
            const Icon = done ? CheckCircle2 : Circle;
            return (
              <Link key={step.id} href={step.href} className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                <Icon className={cn("shrink-0", done ? "text-emerald-600" : "text-gray-300")} size={18} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{lt(step.title)}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{lt(step.description)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-sky-700 shadow-sm">
                  {lt(step.ctaLabel)}
                  <ArrowRight size={11} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
