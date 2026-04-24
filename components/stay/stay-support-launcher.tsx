"use client";

import Link from "next/link";
import { PhoneCall, ExternalLink } from "lucide-react";
import { stayResources } from "@/data/stay-resources";
import { useLocalizedText } from "@/lib/text-localizer";

export function StaySupportLauncher() {
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{lt("Official support launcher")}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Keep official immigration, NHIS, student, and resident support routes one tap away.")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {stayResources.map((resource) => (
          <Link key={resource.id} href={resource.link ?? "#"} target={resource.link ? "_blank" : undefined} rel={resource.link ? "noreferrer" : undefined} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{lt(resource.title)}</p>
                <p className="mt-1 text-xs text-gray-500">{lt(resource.provider)}</p>
              </div>
              {resource.contactValue ? <PhoneCall size={16} className="text-emerald-600" /> : <ExternalLink size={16} className="text-gray-400" />}
            </div>
            {resource.contactValue ? <p className="mt-2 text-xs font-medium text-emerald-700">{lt(resource.contactLabel)}: {resource.contactValue}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
