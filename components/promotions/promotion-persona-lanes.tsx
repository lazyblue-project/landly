"use client";

import { BriefcaseBusiness, HeartPulse, ShoppingBag, Sparkles, UserRoundCheck } from "lucide-react";
import { PromotionAudience, PromotionEvent } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface Lane {
  id: "all" | PromotionAudience;
  label: string;
  description: string;
  icon: typeof Sparkles;
}

const lanes: Lane[] = [
  { id: "all", label: "All picks", description: "Everything active or upcoming", icon: Sparkles },
  { id: "first_timer", label: "First-timer", description: "Easy intro plans", icon: UserRoundCheck },
  { id: "shopper", label: "Shopper", description: "Refund and beauty", icon: ShoppingBag },
  { id: "wellness", label: "Wellness", description: "Care-ready plans", icon: HeartPulse },
  { id: "student", label: "Student", description: "Campus and local life", icon: BriefcaseBusiness },
  { id: "resident", label: "Resident", description: "Long-stay routines", icon: BriefcaseBusiness },
];

export function PromotionPersonaLanes({ events, value, onChange }: { events: PromotionEvent[]; value: Lane["id"]; onChange: (value: Lane["id"]) => void }) {
  const { lt } = useLocalizedText();
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Choose your promo lane")}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Filter events by the reason someone opened Landly today.")}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {lanes.map((lane) => {
          const Icon = lane.icon;
          const count = lane.id === "all" ? events.length : events.filter((event) => event.audience.includes(lane.id as PromotionAudience)).length;
          return (
            <button key={lane.id} type="button" onClick={() => onChange(lane.id)} className={`rounded-2xl border px-3 py-3 text-left transition-colors ${value === lane.id ? "border-violet-200 bg-violet-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
              <div className="flex items-center justify-between gap-2">
                <Icon size={15} className={value === lane.id ? "text-violet-600" : "text-gray-400"} />
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500 ring-1 ring-gray-100">{count}</span>
              </div>
              <p className="mt-2 text-xs font-semibold text-gray-900">{lt(lane.label)}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{lt(lane.description)}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
