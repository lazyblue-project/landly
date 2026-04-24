"use client";

import { stayResources } from "@/data/stay-resources";
import { StayResourceCard } from "./stay-resource-card";
import { useLocalizedText } from "@/lib/text-localizer";

const priorityGroups = [
  {
    title: "Housing safety",
    description: "Before signing or paying a deposit, bookmark an official housing support route and keep your contract notes together.",
    ids: ["stay_resource_005", "stay_resource_004"],
  },
  {
    title: "Work, tax, and insurance basics",
    description: "Start from official routes when your visa, job status, insurance, or tax timeline could be affected.",
    ids: ["stay_resource_002", "stay_resource_006", "stay_resource_007"],
  },
];

export function StayGuideHub() {
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4">
      {priorityGroups.map((group) => (
        <section key={group.title} className="space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{lt(group.title)}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(group.description)}</p>
          </div>
          {stayResources.filter((resource) => group.ids.includes(resource.id)).map((resource) => <StayResourceCard key={resource.id} resource={resource} />)}
        </section>
      ))}
    </div>
  );
}
