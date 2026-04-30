"use client";

import { Ambulance, FileText, Phone, ShieldAlert } from "lucide-react";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { emergencySupportRoutes } from "@/data/emergency-support-routes";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface EmergencyNumberHubProps {
  compact?: boolean;
}

const routeIcon = {
  medical: Ambulance,
  police: ShieldAlert,
  tourist: Phone,
  immigration: FileText,
  "medical-info": Phone,
} as const;

const toneClass = {
  red: "text-red-600 bg-red-50",
  blue: "text-blue-600 bg-blue-50",
  emerald: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-700 bg-amber-50",
} as const;

export function EmergencyNumberHub({ compact = false }: EmergencyNumberHubProps) {
  const { lt } = useLocalizedText();
  const routes = compact ? emergencySupportRoutes.slice(0, 3) : emergencySupportRoutes;

  return (
    <section className="px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Official help numbers")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Tap to call. Use 119 or 112 first when safety is at risk.")}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {routes.map((item) => {
          const Icon = routeIcon[item.id];

          return (
            <article key={item.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={cn("rounded-2xl p-3", toneClass[item.tone])}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">{lt(item.title)}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.number}</p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(item.description)}</p>
                </div>
              </div>

              {!compact ? (
                <>
                  <p className="mt-3 rounded-2xl bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-600">{lt(item.whenToUse)}</p>
                  <SourceDisclosure metadata={item} compact className="mt-3" />
                </>
              ) : null}

              <a href={`tel:${item.number}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-3 py-3 text-xs font-semibold text-white">
                {lt("Call now")} <Phone size={13} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
