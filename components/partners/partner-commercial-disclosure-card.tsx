"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import type { PartnerOffer } from "@/types";
import {
  getPartnerDisclosureBadges,
  getPartnerDisclosureChecklist,
  getPartnerDisclosureSeverity,
  getRevenueModelCopy,
} from "@/lib/partner-disclosure";
import { useLocalizedText } from "@/lib/text-localizer";

interface PartnerCommercialDisclosureCardProps {
  offer: PartnerOffer;
  acknowledged: boolean;
  onAcknowledge: () => void;
  compact?: boolean;
}

export function PartnerCommercialDisclosureCard({ offer, acknowledged, onAcknowledge, compact = false }: PartnerCommercialDisclosureCardProps) {
  const { lt } = useLocalizedText();
  const copy = getRevenueModelCopy(offer.revenueModel);
  const severity = getPartnerDisclosureSeverity(offer);
  const checklist = getPartnerDisclosureChecklist(offer);
  const badges = getPartnerDisclosureBadges(offer);
  const severityTitle = severity === "high" ? "Extra confirmation required" : severity === "medium" ? "Commercial relationship disclosed" : "Pilot flow disclosed";

  return (
    <div className={`rounded-2xl border ${severity === "high" ? "border-amber-200 bg-amber-50" : "border-violet-100 bg-violet-50/70"} ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-violet-700 ring-1 ring-violet-100">
          {acknowledged ? <CheckCircle2 size={17} /> : severity === "high" ? <AlertTriangle size={17} /> : <ShieldCheck size={17} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-950">{lt(severityTitle)}</p>
            {acknowledged ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">{lt("Acknowledged")}</span> : null}
          </div>
          <TrustBadgeRow badges={badges} compact />
          <div className="mt-3 space-y-2 text-xs leading-relaxed text-gray-700">
            <p><span className="font-semibold text-gray-900">{lt("How Landly may earn:")}</span> {lt(copy.plainMeaning)}</p>
            <p><span className="font-semibold text-gray-900">{lt("What the user should know:")}</span> {lt(offer.commercialDisclosure?.userImpact ?? copy.userImpact)}</p>
            {offer.commercialDisclosure?.rankingNote ? (
              <p><span className="font-semibold text-gray-900">{lt("Ranking note:")}</span> {lt(offer.commercialDisclosure.rankingNote)}</p>
            ) : null}
          </div>
          {!compact ? (
            <ul className="mt-3 space-y-1.5">
              {checklist.map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-relaxed text-gray-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={13} />
                  <span>{lt(item)}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {!acknowledged ? (
            <button
              type="button"
              onClick={onAcknowledge}
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-3 py-2.5 text-xs font-semibold text-white"
            >
              {lt("I understand this disclosure")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
