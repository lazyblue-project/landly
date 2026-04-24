"use client";

import { useMemo } from "react";
import { places } from "@/data/places";
import { useAppStore } from "@/store/app-store";
import { EmptyState } from "@/components/common/empty-state";
import { PlaceCard } from "@/components/common/place-card";
import { SectionHeader } from "@/components/common/section-header";
import { MapPin } from "lucide-react";
import { useUiCopy } from "@/lib/ui-copy";

export function SavedPlacesSection() {
  const { user } = useAppStore();
  const { t } = useUiCopy();

  const savedPlaces = useMemo(() => {
    return places.filter((place) => user.savedPlaceIds.includes(place.id));
  }, [user.savedPlaceIds]);

  return (
    <section className="px-4 py-2">
      <SectionHeader
        title={t("my.saved_places")}
        subtitle={t("my.saved_places_subtitle")}
      />
      {savedPlaces.length === 0 ? (
        <EmptyState
          icon={<MapPin size={36} />}
          title={t("common.empty_saved_places")}
        />
      ) : (
        <div className="space-y-3">
          {savedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </section>
  );
}
