"use client";

import Link from "next/link";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { careSupportResources } from "@/data/care-support";
import { useLocalizedText } from "@/lib/text-localizer";

export function HelpLauncher() {
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-3">
      {careSupportResources.map((resource) => (
        <Link key={resource.id} href={resource.href} className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{lt(resource.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(resource.description)}</p>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">{lt(resource.tag)}</span>
          </div>
          <SourceDisclosure metadata={resource} compact className="mt-3" />
        </Link>
      ))}
    </div>
  );
}
