"use client";

import { Globe2, MapPin, MoonStar, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { useAppStore } from "@/store/app-store";
import { CareProvider } from "@/types";
import { getCareTrustBadges } from "@/lib/trust-badges";
import { useLocalizedText } from "@/lib/text-localizer";

export function CareProviderCard({ provider, onOpen }: { provider: CareProvider; onOpen: () => void }) {
  const { savedCareProviderIds, toggleSavedCareProvider } = useAppStore();
  const isSaved = savedCareProviderIds.includes(provider.id);
  const trustBadges = getCareTrustBadges(provider);
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt(provider.name)}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            <span>{lt(provider.district)}</span>
          </div>
        </div>
        <button type="button" onClick={() => toggleSavedCareProvider(provider.id)} className={`rounded-lg border px-2 py-1 text-xs ${isSaved ? "border-rose-200 bg-rose-50 text-rose-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
          {isSaved ? lt("Saved") : lt("Save")}
        </button>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-600">{lt(provider.description)}</p>
      <TrustBadgeRow badges={trustBadges} compact />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.internationalCare && <Badge variant="secondary">{lt("International")}</Badge>}
        {provider.kahfFriendly && <Badge variant="secondary">{lt("KAHF signal")}</Badge>}
        {provider.reservationSupported && <Badge variant="secondary">{lt("Reservation")}</Badge>}
        {provider.nightHours && <Badge variant="secondary">{lt("Night hours")}</Badge>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1"><Globe2 size={12} /> {provider.supportedLanguages.map((language) => lt(language)).join(", ")}</span>
        <span className="inline-flex items-center gap-1"><Stethoscope size={12} /> {lt(provider.category)}</span>
        {provider.nightHours && <span className="inline-flex items-center gap-1"><MoonStar size={12} /> {lt("Open late")}</span>}
      </div>

      <button type="button" onClick={onOpen} className="mt-4 w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-medium text-white">
        {lt("View details")}
      </button>
    </div>
  );
}
