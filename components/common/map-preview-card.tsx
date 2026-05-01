"use client";

import { ExternalLink, MapPinned, Navigation, ShieldAlert } from "lucide-react";
import { getMapPreviewPayload, MapHandoffTarget } from "@/lib/map-handoff";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface MapPreviewCardProps {
  target: MapHandoffTarget;
  compact?: boolean;
  className?: string;
}

export function MapPreviewCard({ target, compact = false, className }: MapPreviewCardProps) {
  const { lt } = useLocalizedText();
  const preview = getMapPreviewPayload(target);
  const visibleLinks = compact ? preview.links.slice(0, 3) : preview.links.slice(0, 4);

  return (
    <div className={cn("rounded-2xl border border-sky-100 bg-sky-50/70 p-3", className)}>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 text-sky-700 shadow-sm">
          <MapPinned size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{lt("Map preview pilot")}</p>
            {preview.hasExplicitMapLink ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">
                {lt("Saved link")}
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-gray-950">{lt(target.name)}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">{lt(preview.displayArea)}</p>
        </div>
      </div>

      {!compact ? (
        <div className="mt-3 rounded-2xl bg-white/80 p-3 text-xs leading-relaxed text-gray-600">
          <div className="flex gap-2">
            <ShieldAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <p>{lt(preview.safetyNote)}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-2">
        {visibleLinks.map((link) => (
          <a
            key={`${target.id ?? target.name}-${link.id}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm ring-1 ring-sky-100"
          >
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Navigation size={13} className="shrink-0 text-sky-600" />
              <span className="truncate">{lt(link.label)}</span>
            </span>
            <ExternalLink size={12} className="shrink-0 text-gray-400" />
          </a>
        ))}
      </div>
    </div>
  );
}
