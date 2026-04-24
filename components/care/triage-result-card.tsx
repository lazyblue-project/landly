"use client";

import Link from "next/link";
import { Ambulance, HeartPulse, Info, Pill, ShieldPlus } from "lucide-react";
import { CareTriageResult } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

const levelStyle = {
  emergency: {
    card: "border-red-200 bg-red-50",
    text: "text-red-800",
    icon: Ambulance,
  },
  hotline: {
    card: "border-orange-200 bg-orange-50",
    text: "text-orange-800",
    icon: ShieldPlus,
  },
  pharmacy: {
    card: "border-emerald-200 bg-emerald-50",
    text: "text-emerald-800",
    icon: Pill,
  },
  clinic: {
    card: "border-sky-200 bg-sky-50",
    text: "text-sky-800",
    icon: HeartPulse,
  },
  specialist: {
    card: "border-purple-200 bg-purple-50",
    text: "text-purple-800",
    icon: Info,
  },
} as const;

const actionHref: Record<CareTriageResult["nextActions"][number], string> = {
  "call-119": "tel:119",
  "call-1339": "tel:1339",
  "open-1330": "tel:1330",
  "find-pharmacy": "/care?tab=providers&category=pharmacy",
  "find-clinic": "/care?tab=providers&category=clinic",
  "find-specialist": "/care?tab=providers&category=dermatology",
};

const actionLabel: Record<CareTriageResult["nextActions"][number], string> = {
  "call-119": "Call 119",
  "call-1339": "Call 1339",
  "open-1330": "Call 1330",
  "find-pharmacy": "Find a pharmacy",
  "find-clinic": "Find a clinic",
  "find-specialist": "Find specialist care",
};

export function TriageResultCard({ result }: { result: CareTriageResult }) {
  const style = levelStyle[result.level];
  const Icon = style.icon;
  const { lt } = useLocalizedText();

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${style.card}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl bg-white p-2 ${style.text}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${style.text}`}>{lt(result.title)}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">{lt(result.summary)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white/80 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{lt("Why this result")}</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {result.reasons.map((reason) => (
            <li key={reason}>• {lt(reason)}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {result.nextActions.map((action) => (
          <Link key={action} href={actionHref[action]} className="rounded-full bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-sm">
            {lt(actionLabel[action])}
          </Link>
        ))}
      </div>
    </div>
  );
}
