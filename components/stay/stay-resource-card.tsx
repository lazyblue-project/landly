"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { StayResource } from "@/types";
import { useAppStore } from "@/store/app-store";
import { getStayResourceTrustBadges } from "@/lib/trust-badges";
import { useLocalizedText } from "@/lib/text-localizer";

interface StayResourceCardProps {
  resource: StayResource;
}

export function StayResourceCard({ resource }: StayResourceCardProps) {
  const { savedStayResourceIds, toggleSavedStayResource } = useAppStore();
  const isSaved = savedStayResourceIds.includes(resource.id);
  const trustBadges = getStayResourceTrustBadges(resource);
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt(resource.title)}</p>
          <p className="mt-1 text-xs text-gray-500">{lt(resource.provider)}</p>
        </div>
        <button onClick={() => toggleSavedStayResource(resource.id)} className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-gray-600 transition-colors hover:bg-gray-100">
          {isSaved ? <BookmarkCheck size={16} className="text-emerald-600" /> : <Bookmark size={16} />}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-gray-600">{lt(resource.description)}</p>
      <TrustBadgeRow badges={trustBadges} compact />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {resource.contactValue ? <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">{lt(resource.contactLabel)}: {resource.contactValue}</span> : null}
        {resource.type ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">{lt(resource.type)}</span> : null}
      </div>
      {resource.link ? (
        <Link href={resource.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          {lt("Open official resource")}
          <ExternalLink size={14} />
        </Link>
      ) : null}
    </div>
  );
}
