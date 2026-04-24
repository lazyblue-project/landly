"use client";

import Link from "next/link";
import { LifeChecklistItem, StayResource } from "@/types";
import { StayResourceCard } from "./stay-resource-card";
import { useLocalizedText } from "@/lib/text-localizer";

interface StayPlanSummaryProps {
  immediateTasks: LifeChecklistItem[];
  thisMonthTasks: LifeChecklistItem[];
  resources: StayResource[];
  reminders: string[];
}

export function StayPlanSummary({ immediateTasks, thisMonthTasks, resources, reminders }: StayPlanSummaryProps) {
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Do these first")}</p>
        <div className="mt-3 space-y-2">
          {immediateTasks.map((task) => (
            <Link key={task.id} href={`/stay?tab=checklist&category=${task.category}`} className="block rounded-xl bg-emerald-50 px-3 py-3">
              <p className="text-sm font-medium text-gray-900">{lt(task.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(task.description)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Later this month")}</p>
        <div className="mt-3 space-y-2">
          {thisMonthTasks.map((task) => (
            <div key={task.id} className="rounded-xl bg-gray-50 px-3 py-3">
              <p className="text-sm font-medium text-gray-900">{lt(task.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(task.estimatedTime)} · {lt(task.category)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Keep in mind")}</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          {reminders.map((reminder) => (
            <li key={reminder} className="rounded-xl bg-amber-50 px-3 py-3 leading-relaxed">{lt(reminder)}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Official resources")}</p>
          <p className="mt-1 text-xs text-gray-500">{lt("Open official routes first whenever the process affects visa, insurance, tax, or labor status.")}</p>
        </div>
        {resources.map((resource) => <StayResourceCard key={resource.id} resource={resource} />)}
      </section>
    </div>
  );
}
