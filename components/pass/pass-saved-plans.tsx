"use client";

import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { EmptyState } from "@/components/common/empty-state";
import { CalendarClock, Trash2 } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

interface SavedPassPlansProps {
  compact?: boolean;
}

export function SavedPassPlans({ compact = false }: SavedPassPlansProps) {
  const { savedPassPlans, removePassPlan } = useAppStore();
  const { lt } = useLocalizedText();

  if (savedPassPlans.length === 0) {
    return (
      <div className={compact ? "px-4 pb-4" : ""}>
        <EmptyState icon={<CalendarClock size={40} />} title="No saved pass plans yet" description="Save one airport route or pass recommendation so you can pull it up quickly later." />
      </div>
    );
  }

  const plans = compact ? savedPassPlans.slice(0, 2) : savedPassPlans;

  return (
    <section className={compact ? "px-4 pb-4" : "rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"}>
      {compact ? (
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Saved pass plans")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Re-open the route you planned before landing.")}</p>
          </div>
          <Link href="/pass?tab=saved" className="text-xs font-medium text-sky-600">{lt("View all")}</Link>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900">{lt("Saved pass plans")}</p>
          <p className="mt-1 text-xs text-gray-500">{lt("Re-open your exact saved route and transport pass decisions.")}</p>
        </div>
      )}

      <div className="space-y-3">
        {plans.map((plan) => {
          const selectedOption = plan.transitOptions.find((option) => option.id === plan.selectedTransitOptionId) ?? plan.transitOptions[0];
          return (
            <div key={plan.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                  <p className="mt-1 text-xs text-gray-600">{plan.summary}</p>
                  {selectedOption ? <p className="mt-1 text-xs font-medium text-sky-700">{lt("Saved route:")} {lt(selectedOption.title)}</p> : null}
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">{lt("Saved")} {new Date(plan.savedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => removePassPlan(plan.id)} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100" aria-label={lt("Remove")}><Trash2 size={14} /></button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="rounded-full bg-white px-2.5 py-1">{lt(plan.input.airport)}</span>
                <span className="rounded-full bg-white px-2.5 py-1">{lt(plan.input.destinationArea)}</span>
                <span className="rounded-full bg-white px-2.5 py-1 capitalize">{lt(plan.input.arrivalTimeBand.replace("_", " "))}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
