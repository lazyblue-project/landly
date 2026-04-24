"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bookmark, ExternalLink } from "lucide-react";
import { stayResources } from "@/data/stay-resources";
import { useAppStore } from "@/store/app-store";
import { EmptyState } from "@/components/common/empty-state";
import { SectionHeader } from "@/components/common/section-header";
import { useLocalizedText } from "@/lib/text-localizer";

export function SavedStayResourcesSection() {
  const savedStayResourceIds = useAppStore((state) => state.savedStayResourceIds);
  const { lt } = useLocalizedText();

  const savedResources = useMemo(
    () => stayResources.filter((resource) => savedStayResourceIds.includes(resource.id)),
    [savedStayResourceIds]
  );

  return (
    <section className="px-4 py-2">
      <SectionHeader
        title="Saved stay resources"
        subtitle="Official help routes you've bookmarked for later."
      />
      {savedResources.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={36} />}
          title="No saved stay resources yet"
          description="Bookmark immigration, insurance, housing, or labor resources in Landly Stay."
        />
      ) : (
        <div className="space-y-3">
          {savedResources.map((resource) => (
            <div key={resource.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lt(resource.title)}</p>
                  <p className="mt-1 text-xs text-gray-500">{lt(resource.provider)}</p>
                </div>
                <Link
                  href="/stay?tab=guides"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                >
                  {lt("Open Stay")}
                </Link>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-600">{lt(resource.description)}</p>
              {resource.link ? (
                <Link
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"
                >
                  {lt("Open official resource")}
                  <ExternalLink size={14} />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
