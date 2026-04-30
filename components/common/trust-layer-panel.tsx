"use client";

import { ShieldCheck } from "lucide-react";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { TrustBadge } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

const badges: TrustBadge[] = [
  { id: "trust_panel_official", label: "Official source", tone: "emerald" },
  { id: "trust_panel_curated", label: "Landly-curated", tone: "sky" },
  { id: "trust_panel_partner", label: "Partner info", tone: "violet" },
  { id: "trust_panel_needs", label: "Needs confirmation", tone: "amber" },
];

interface TrustLayerPanelProps {
  title?: string;
  description?: string;
}

export function TrustLayerPanel({ title = "Trust layer", description = "Landly separates official sources, curated guidance, partner information, and demo data so you know what to confirm before acting." }: TrustLayerPanelProps) {
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
          <ShieldCheck size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{lt(title)}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(description)}</p>
          <TrustBadgeRow badges={badges} compact />
        </div>
      </div>
    </div>
  );
}
