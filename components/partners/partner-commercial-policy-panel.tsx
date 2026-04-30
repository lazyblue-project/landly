"use client";

import { BadgePercent, ShieldCheck } from "lucide-react";
import { partnerDisclosurePrinciples } from "@/lib/partner-disclosure";
import { useLocalizedText } from "@/lib/text-localizer";

interface PartnerCommercialPolicyPanelProps {
  compact?: boolean;
}

export function PartnerCommercialPolicyPanel({ compact = false }: PartnerCommercialPolicyPanelProps) {
  const { lt } = useLocalizedText();

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-50 p-2 text-violet-700 ring-1 ring-violet-100">
          <BadgePercent size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-950">{lt("Commercial transparency rules")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {lt("Landly can test partner revenue, but users should see the relationship before they save, inquire, book, or pay.")}
          </p>
        </div>
      </div>
      <div className={`mt-4 grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1"}`}>
        {partnerDisclosurePrinciples.map((principle) => (
          <div key={principle.id} className="rounded-2xl bg-gray-50 p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 shrink-0 text-violet-600" size={14} />
              <div>
                <p className="text-xs font-semibold text-gray-900">{lt(principle.title)}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(principle.description)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
