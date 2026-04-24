"use client";

import { BookOpenText, CalendarClock } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

interface StayHeroProps {
  stayTypeLabel: string;
  city: string;
}

export function StayHero({ stayTypeLabel, city }: StayHeroProps) {
  const { lt } = useLocalizedText();

  return (
    <section className="bg-gradient-to-br from-emerald-700 to-teal-600 px-4 pb-5 pt-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-emerald-100">{lt("Landly Stay")}</p>
          <h1 className="mt-1 text-2xl font-bold">{lt("Settle in with less guesswork")}</h1>
          <p className="mt-2 text-xs leading-relaxed text-emerald-100">
            {lt("Your {stayTypeLabel} setup plan for {city}. Focus on the next official step, not ten open tabs.", {
              stayTypeLabel: lt(stayTypeLabel.toLowerCase()),
              city: lt(city),
            })}
          </p>
        </div>
        <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
          <BookOpenText size={22} />
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm">
        <CalendarClock size={16} />
        {lt("Review this week's setup tasks")}
      </div>
    </section>
  );
}
