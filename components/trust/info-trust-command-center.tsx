"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, TriangleAlert } from "lucide-react";
import { infoTrustActions } from "@/data/info-trust-actions";
import { careProviders } from "@/data/care-providers";
import { careSupportResources } from "@/data/care-support";
import { partnerOffers } from "@/data/partner-offers";
import { places } from "@/data/places";
import { shopStores } from "@/data/shop-stores";
import { stayResources } from "@/data/stay-resources";
import { useLocalizedText } from "@/lib/text-localizer";
import { getFreshnessSummary } from "@/lib/trust-freshness";
import type { TrustMetadata } from "@/types";

interface InfoTrustCommandCenterProps {
  compact?: boolean;
}

const trustItems: TrustMetadata[] = [
  ...places,
  ...shopStores,
  ...careProviders,
  ...careSupportResources,
  ...stayResources,
  ...partnerOffers,
];

const categoryTone = {
  official: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  confirm: "bg-amber-50 text-amber-700 ring-amber-100",
  commercial: "bg-violet-50 text-violet-700 ring-violet-100",
  saved: "bg-sky-50 text-sky-700 ring-sky-100",
} as const;

export function InfoTrustCommandCenter({ compact = false }: InfoTrustCommandCenterProps) {
  const { lt } = useLocalizedText();
  const officialCount = trustItems.filter((item) => item.trustLevel === "official").length;
  const needsCheckCount = trustItems.filter((item) => getFreshnessSummary(item).shouldConfirm).length;
  const partnerCount = trustItems.filter((item) => item.trustLevel === "partner" || item.trustLevel === "demo").length;
  const staleCount = trustItems.filter((item) => {
    const status = getFreshnessSummary(item).status;
    return status === "stale" || status === "unknown";
  }).length;
  const freshCount = trustItems.filter((item) => getFreshnessSummary(item).status === "fresh").length;
  const visibleActions = compact ? infoTrustActions.slice(0, 3) : infoTrustActions;

  return (
    <section className={compact ? "px-4 pb-4" : "space-y-4"}>
      <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{lt("Trust & freshness")}</p>
            <h2 className="mt-1 text-lg font-semibold text-gray-950">{lt("Know what to trust before you act")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {lt("Landly marks official sources, curated guidance, demo data, partner offers, and items that still need confirmation.")}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="text-2xl font-semibold text-emerald-800">{officialCount}</p>
            <p className="mt-1 text-[11px] font-medium text-emerald-700">{lt("official-source items")}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <p className="text-2xl font-semibold text-amber-800">{needsCheckCount}</p>
            <p className="mt-1 text-[11px] font-medium text-amber-700">{lt("need confirmation")}</p>
          </div>
          {!compact ? (
            <>
              <div className="rounded-2xl bg-violet-50 p-3">
                <p className="text-2xl font-semibold text-violet-800">{partnerCount}</p>
                <p className="mt-1 text-[11px] font-medium text-violet-700">{lt("partner/demo lanes")}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-3">
                <p className="text-2xl font-semibold text-gray-900">{freshCount}/{trustItems.length}</p>
                <p className="mt-1 text-[11px] font-medium text-gray-600">{lt("fresh source checks")}</p>
              </div>
            </>
          ) : null}
        </div>

        {staleCount > 0 ? (
          <div className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs leading-relaxed text-rose-700">
            <div className="flex gap-2">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" />
              <p>{lt("Some cards have stale or missing freshness dates. Open the official source first before acting.")}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <div className="flex gap-2">
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            <p>{lt("Landly is a guide layer, not a final authority. Confirm official rules, hours, prices, and eligibility before you move, pay, or visit.")}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {visibleActions.map((action) => (
            <Link key={action.id} href={action.primaryHref} className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-3 transition-colors hover:bg-gray-100">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${categoryTone[action.category]}`}>{lt(action.module)}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400"><BadgeCheck size={11} /> {lt("check before action")}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-gray-900">{lt(action.title)}</p>
                {!compact ? <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{lt(action.description)}</p> : null}
              </div>
              <ArrowRight size={15} className="shrink-0 text-gray-400" />
            </Link>
          ))}
        </div>

        {compact ? (
          <Link href="/trust" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            {lt("Open trust center")} <ArrowRight size={13} />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
