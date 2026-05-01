"use client";

import Link from "next/link";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { LiveOpenStatusBadge } from "@/components/common/live-open-status-badge";
import { MapPreviewCard } from "@/components/common/map-preview-card";
import { ExternalLink, MapPinned, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CareProvider } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface CareProviderDetailSheetProps {
  provider: CareProvider | null;
  onClose: () => void;
}

export function CareProviderDetailSheet({ provider, onClose }: CareProviderDetailSheetProps) {
  const { lt } = useLocalizedText();
  if (!provider) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 px-4 py-10" onClick={onClose}>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt(provider.name)}</p>
            <p className="mt-1 text-xs text-gray-500">{lt(provider.district)} · {lt(provider.category)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {lt("Close")}
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">{lt(provider.description)}</p>
        <div className="mt-3"><LiveOpenStatusBadge metadata={provider} /></div>
        <SourceDisclosure metadata={provider} className="mt-4" />
        <MapPreviewCard
          className="mt-4"
          target={{
            id: provider.id,
            name: provider.name,
            district: provider.district,
            mapLink: provider.mapLink,
          }}
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.supportedLanguages.map((language) => (
            <Badge key={lt(language)} variant="secondary">{lt(language)}</Badge>
          ))}
          {provider.internationalCare && <Badge variant="secondary">{lt("International care")}</Badge>}
          {provider.kahfFriendly && <Badge variant="secondary">{lt("KAHF signal")}</Badge>}
          {provider.reservationSupported && <Badge variant="secondary">{lt("Reservation")}</Badge>}
          {provider.touristFriendly && <Badge variant="secondary">{lt("Tourist friendly")}</Badge>}
        </div>

        <div className="mt-4 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{lt("Specialties")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {provider.specialties.map((specialty) => (
              <span key={specialty} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700">
                {lt(specialty)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Link href={provider.mapLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-gray-700">
            <MapPinned size={15} /> {lt("Open map")}
          </Link>
          {provider.phone ? (
            <Link href={`tel:${provider.phone}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-gray-700">
              <Phone size={15} /> {lt("Call now")}
            </Link>
          ) : (
            <Link href="/assistant?category=hospital" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-gray-700">
              <Phone size={15} /> {lt("Show")}
            </Link>
          )}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <Link href="/care?tab=prep" className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3 py-3 font-medium text-white">
            {lt("Visit prep")}
          </Link>
          <Link href={provider.sourceUrl ?? provider.officialLink ?? provider.mapLink} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-3 font-medium text-white">
            <ExternalLink size={15} /> {lt("Official link")}
          </Link>
        </div>
      </div>
    </div>
  );
}
