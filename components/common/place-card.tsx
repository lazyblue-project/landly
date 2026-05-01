"use client";

import { Clock, CreditCard, MapPin, Star } from "lucide-react";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { LiveOpenStatusBadge } from "@/components/common/live-open-status-badge";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { MapPreviewCard } from "@/components/common/map-preview-card";
import { Place } from "@/types";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { useUiCopy } from "@/lib/ui-copy";
import { getPlaceTrustBadges } from "@/lib/trust-badges";
import { useLocalizedText } from "@/lib/text-localizer";

interface PlaceCardProps { place: Place; className?: string; }

export function PlaceCard({ place, className }: PlaceCardProps) {
  const { user, toggleSavedPlace } = useAppStore();
  const { t } = useUiCopy();
  const { lt } = useLocalizedText();
  const isSaved = user.savedPlaceIds.includes(place.id);
  const trustBadges = getPlaceTrustBadges(place);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2"><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-gray-900">{lt(place.name)}</h3><div className="mt-0.5 flex items-center gap-1"><MapPin size={12} className="shrink-0 text-gray-400" /><span className="truncate text-xs text-gray-500">{lt(place.address)}</span></div></div><button onClick={() => toggleSavedPlace(place.id)} className={cn("shrink-0 rounded-lg border px-2 py-1 text-xs transition-colors", isSaved ? "border-blue-200 bg-blue-50 text-blue-600" : "border-gray-200 bg-gray-50 text-gray-500")}>{isSaved ? t("common.saved") : t("common.save")}</button></div>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{lt(place.description)}</p>
        <div className="mt-3"><LiveOpenStatusBadge metadata={place} /></div>
        <TrustBadgeRow badges={trustBadges} compact />
        <SourceDisclosure metadata={place} compact className="mt-3" />
        <MapPreviewCard
          compact
          className="mt-3"
          target={{
            id: place.id,
            name: place.name,
            address: place.address,
            city: place.city,
            naverMapsUrl: place.naverMapsUrl,
            googleMapsUrl: place.googleMapsUrl,
          }}
        />
        <div className="mt-3 flex items-center gap-3"><div className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /><span className="text-xs font-medium text-gray-700">{place.rating}</span><span className="text-xs text-gray-400">({place.reviewCount})</span></div>{place.foreignCardSupported ? <div className="flex items-center gap-1"><CreditCard size={12} className="text-green-500" /><span className="text-xs text-gray-500">{lt("Card OK")}</span></div> : null}{place.lateNight ? <div className="flex items-center gap-1"><Clock size={12} className="text-amber-500" /><span className="text-xs text-gray-500">{lt("Open late")}</span></div> : null}</div>
      </div>
    </div>
  );
}
