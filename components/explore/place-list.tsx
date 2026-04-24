"use client";

import { PlaceCard } from "@/components/common/place-card";
import { EmptyState } from "@/components/common/empty-state";
import { MapPin } from "lucide-react";
import { Place } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface PlaceListProps {
  places: Place[];
}

export function PlaceList({ places }: PlaceListProps) {
  const { lt } = useLocalizedText();

  if (places.length === 0) {
    return (
      <EmptyState
        icon={<MapPin size={40} />}
        title={lt("No places found")}
        description={lt("Try adjusting your filters or search terms")}
      />
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
