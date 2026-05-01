"use client";

import { CalendarIcon, CheckCircle2, ExternalLink } from "lucide-react";
import type { CalendarEvent } from "@/types";
import { downloadIcsCalendar } from "@/lib/ics-export";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

interface CalendarExportPanelProps {
  events: CalendarEvent[];
}

function buildCalendarFileName() {
  const date = new Date().toISOString().slice(0, 10);
  return `landly-calendar-${date}.ics`;
}

export function CalendarExportPanel({ events }: CalendarExportPanelProps) {
  const { lt } = useLocalizedText();
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const hasEvents = events.length > 0;

  const handleExport = () => {
    if (!hasEvents) {
      showSnackbar(lt("Add at least one event before exporting."), "warning");
      return;
    }

    downloadIcsCalendar(events, buildCalendarFileName());
    showSnackbar(lt("Calendar .ics file downloaded"), "success");
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-emerald-700 ring-1 ring-emerald-100">
          <CalendarIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-950">{lt("Export to external calendar")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {lt("Download all Landly calendar items as an .ics file that can be imported into Google Calendar, Apple Calendar, Outlook, or other calendar apps.")}
          </p>
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/80 px-3 py-2 text-[11px] leading-relaxed text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
            <span>{lt("This is a local file export. It does not connect to your calendar account or upload data to a server.")}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleExport}
        disabled={!hasEvents}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <ExternalLink size={16} />
        {hasEvents ? lt("Download .ics calendar") : lt("No events to export yet")}
      </button>
    </section>
  );
}
