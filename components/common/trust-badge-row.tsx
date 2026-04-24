"use client";

import { TrustBadge } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

const toneClasses: Record<TrustBadge["tone"], string> = {
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
};

interface TrustBadgeRowProps {
  badges: TrustBadge[];
  compact?: boolean;
}

export function TrustBadgeRow({ badges, compact = false }: TrustBadgeRowProps) {
  const { lt } = useLocalizedText();
  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "mt-2" : "mt-3"}`}>
      {badges.map((badge) => (
        <span
          key={badge.id}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${toneClasses[badge.tone]}`}
        >
          {lt(badge.label)}
        </span>
      ))}
    </div>
  );
}
