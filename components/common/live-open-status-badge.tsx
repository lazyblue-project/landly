"use client";

import { Clock3 } from "lucide-react";
import { OpeningHoursMetadata } from "@/types";
import { getLiveOpenStatus, LiveOpenState } from "@/lib/opening-hours";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface LiveOpenStatusBadgeProps {
  metadata: OpeningHoursMetadata;
  compact?: boolean;
  className?: string;
}

const toneClass: Record<LiveOpenState, string> = {
  open: "border-emerald-100 bg-emerald-50 text-emerald-700",
  "closing-soon": "border-amber-100 bg-amber-50 text-amber-700",
  "opens-soon": "border-sky-100 bg-sky-50 text-sky-700",
  closed: "border-gray-200 bg-gray-50 text-gray-600",
  unknown: "border-violet-100 bg-violet-50 text-violet-700",
};

export function LiveOpenStatusBadge({ metadata, compact = false, className }: LiveOpenStatusBadgeProps) {
  const { lt } = useLocalizedText();
  const status = getLiveOpenStatus(metadata);

  const detail = status.nextTime
    ? `${lt(status.detail)} ${status.nextDayLabel ? `${lt(status.nextDayLabel)} ` : ""}${status.nextTime}`
    : lt(status.detail);
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClass[status.state],
        className
      )}
      title={status.windowLabel ? `${lt("Window")}: ${status.windowLabel}` : undefined}
    >
      <Clock3 size={12} className="shrink-0" />
      <span className="shrink-0">{lt(status.label)}</span>
      {!compact ? <span className="truncate font-normal opacity-80">· {detail}</span> : null}
    </div>
  );
}
