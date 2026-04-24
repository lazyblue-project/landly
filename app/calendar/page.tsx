"use client";

import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { MonthCalendarView } from "@/components/calendar/month-calendar-view";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function CalendarPage() {
  const { calendarEvents, addCalendarEvent, removeCalendarEvent, hasHydrated } = useAppStore();
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return <AppShell><TopBar title={lt("Calendar")} /><div className="flex min-h-[60vh] items-center justify-center px-4"><div className="text-center"><p className="text-sm font-medium text-gray-700">{lt("Loading Calendar…")}</p><p className="mt-1 text-xs text-gray-500">{lt("Preparing your saved route plans and events.")}</p></div></div></AppShell>;
  }

  return <AppShell><TopBar title={lt("Calendar")} /><div className="px-4 py-4"><MonthCalendarView events={calendarEvents} onAddEvent={addCalendarEvent} onRemoveEvent={removeCalendarEvent} /></div></AppShell>;
}
