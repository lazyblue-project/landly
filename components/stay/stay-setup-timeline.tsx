"use client";

import Link from "next/link";
import { AlertTriangle, CalendarPlus, CheckCircle2, Clock3 } from "lucide-react";
import { StayPlanInput } from "@/types";
import {
  buildStayCheckpoints,
  daysBetween,
  getCheckpointStatus,
  getCheckpointStatusLabel,
  getTodayString,
} from "@/lib/stay-utils";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface StaySetupTimelineProps {
  input: StayPlanInput;
}

const statusStyles = {
  overdue: "border-rose-200 bg-rose-50 text-rose-700",
  "due-soon": "border-amber-200 bg-amber-50 text-amber-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  upcoming: "border-gray-200 bg-gray-50 text-gray-600",
} as const;

function getStatusIcon(status: keyof typeof statusStyles) {
  if (status === "overdue") return AlertTriangle;
  if (status === "due-soon") return Clock3;
  return CheckCircle2;
}

export function StaySetupTimeline({ input }: StaySetupTimelineProps) {
  const { addCalendarEvent, calendarEvents, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();
  const checkpoints = buildStayCheckpoints(input);
  const today = getTodayString();

  const addCheckpointToCalendar = (checkpointId: string) => {
    const checkpoint = checkpoints.find((item) => item.id === checkpointId);
    if (!checkpoint) return;

    addCalendarEvent({
      id: `calendar_${checkpoint.id}`,
      title: checkpoint.title,
      date: checkpoint.dueDate,
      category: "stay",
      note: checkpoint.description,
      sourceHref: checkpoint.href,
    });
    showSnackbar(lt("Added to Calendar"), "success");
  };

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("First 90-day timeline")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("A practical D-day flow from your entry date. Add key checkpoints to Calendar when you want reminders.")}
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
          <p className="text-[11px] font-medium text-emerald-700">{lt("Entry")}</p>
          <p className="text-xs font-semibold text-emerald-900">{input.entryDate}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {checkpoints.map((checkpoint) => {
          const status = getCheckpointStatus(checkpoint.dueDate);
          const Icon = getStatusIcon(status);
          const daysLeft = daysBetween(today, checkpoint.dueDate);
          const calendarId = `calendar_${checkpoint.id}`;
          const isAdded = calendarEvents.some((event) => event.id === calendarId);

          return (
            <article key={checkpoint.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 rounded-xl border p-2", statusStyles[status])}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                      D+{checkpoint.offsetDays}
                    </span>
                    <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusStyles[status])}>
                      {lt(getCheckpointStatusLabel(status))}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500">
                      {checkpoint.dueDate}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{lt(checkpoint.title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(checkpoint.description)}</p>
                  <p className="mt-2 text-[11px] font-medium text-gray-500">
                    {daysLeft < 0
                      ? lt("{days} days late", { days: String(Math.abs(daysLeft)) })
                      : daysLeft === 0
                      ? lt("Due today")
                      : lt("{days} days left", { days: String(daysLeft) })}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link href={checkpoint.href} className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
                  {lt("Open step")}
                </Link>
                <button
                  type="button"
                  onClick={() => addCheckpointToCalendar(checkpoint.id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm",
                    isAdded ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
                  )}
                >
                  <CalendarPlus size={14} />
                  {isAdded ? lt("Added") : lt("Add to Calendar")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
