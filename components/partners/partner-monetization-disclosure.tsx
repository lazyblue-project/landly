"use client";

import { BadgePercent, ShieldCheck } from "lucide-react";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { TrustBadge } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

const disclosureBadges: TrustBadge[] = [
  { id: "partner_disclosure_commercial", label: "Commercial model", tone: "violet" },
  { id: "partner_disclosure_curated", label: "Landly-curated", tone: "sky" },
  { id: "partner_disclosure_needs", label: "Needs confirmation", tone: "amber" },
];

interface PartnerMonetizationDisclosureProps {
  compact?: boolean;
}

export function PartnerMonetizationDisclosure({ compact = false }: PartnerMonetizationDisclosureProps) {
  const { lt } = useLocalizedText();

  return (
    <div className={`rounded-2xl border border-violet-100 bg-violet-50/70 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-violet-700 ring-1 ring-violet-100">
          {compact ? <BadgePercent size={16} /> : <ShieldCheck size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-violet-950">{lt("Partner transparency")}</p>
          <p className="mt-1 text-xs leading-relaxed text-violet-800">
            {lt("Some partner lanes may become affiliate, referral, commission, sponsored, or pilot revenue flows. Landly should label the model before a user sends interest and should never hide paid placement inside neutral safety, medical, or official-source guidance.")}
          </p>
          {!compact ? <TrustBadgeRow badges={disclosureBadges} compact /> : null}
        </div>
      </div>
    </div>
  );
}
