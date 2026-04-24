"use client";

import { useLocalizedText } from "@/lib/text-localizer";

interface StayDeadlineCardsProps {
  reminders: string[];
}

export function StayDeadlineCards({ reminders }: StayDeadlineCardsProps) {
  const { lt } = useLocalizedText();
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {reminders.map((reminder, index) => (
        <div key={reminder} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            {index === 0 ? lt("This week") : index === 1 ? lt("Soon") : lt("Don't forget")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{lt(reminder)}</p>
        </div>
      ))}
    </div>
  );
}
