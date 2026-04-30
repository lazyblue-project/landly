"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck, TriangleAlert } from "lucide-react";
import { TrustMetadata } from "@/types";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";
import { getFreshnessSummary } from "@/lib/trust-freshness";

interface SourceDisclosureProps {
  metadata: TrustMetadata;
  className?: string;
  compact?: boolean;
}

const trustLabel: Record<NonNullable<TrustMetadata["trustLevel"]>, string> = {
  official: "Official source",
  partner: "Partner info",
  curated: "Landly-curated guide",
  demo: "Demo data",
  "needs-check": "Needs confirmation",
};

const freshnessClass = {
  fresh: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  aging: "bg-amber-50 text-amber-700 ring-amber-100",
  stale: "bg-rose-50 text-rose-700 ring-rose-100",
  unknown: "bg-amber-50 text-amber-700 ring-amber-100",
} as const;

export function SourceDisclosure({ metadata, className, compact = false }: SourceDisclosureProps) {
  const { lt } = useLocalizedText();
  const label = metadata.trustLevel ? trustLabel[metadata.trustLevel] : "Landly-curated guide";
  const freshness = getFreshnessSummary(metadata);
  const shouldWarn = freshness.shouldConfirm;
  const checkedLabel = metadata.lastCheckedAt ? `${lt("Last checked")}: ${metadata.lastCheckedAt}` : lt("No last-checked date saved");

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-gray-50 p-3", className)}>
      <div className="flex items-start gap-2">
        <div className={cn("mt-0.5 rounded-full p-1", shouldWarn ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
          {shouldWarn ? <TriangleAlert size={14} /> : <ShieldCheck size={14} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs font-semibold text-gray-900">{lt(label)}</p>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1", freshnessClass[freshness.status])}>
              {lt(freshness.label)}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{checkedLabel}</p>
          {!compact ? <p className="mt-1 text-[11px] leading-relaxed text-gray-600">{lt(freshness.detail)}</p> : null}
          {!compact && shouldWarn ? <p className="mt-1 text-[11px] leading-relaxed text-amber-700">{lt("Details can change. Confirm hours, eligibility, and rules before visiting or paying.")}</p> : null}
        </div>
      </div>
      {metadata.sourceUrl ? (
        <Link href={metadata.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700">
          {lt(freshness.sourceCtaLabel)}
          <ExternalLink size={12} />
        </Link>
      ) : null}
    </div>
  );
}
