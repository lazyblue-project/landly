import { OpeningDay, OpeningHoursMetadata, OpeningHoursRule } from "@/types";

export type LiveOpenState = "open" | "closing-soon" | "closed" | "opens-soon" | "unknown";

export interface LiveOpenStatus {
  state: LiveOpenState;
  label: string;
  detail: string;
  nextTime?: string;
  nextDayLabel?: string;
  windowLabel?: string;
}

const DAY_ORDER: OpeningDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_LABELS: Record<OpeningDay, string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

const CLOSING_SOON_MINUTES = 60;
const OPENS_SOON_MINUTES = 120;

function parseClock(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour === 24 && minute === 0) return 24 * 60;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return hour * 60 + minute;
}

function formatClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = Math.floor(normalized / 60).toString().padStart(2, "0");
  const minute = (normalized % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function getDayOffset(date: Date, offset: number): OpeningDay {
  return DAY_ORDER[(date.getDay() + offset + 7) % 7];
}

function getMinutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function getWindowLabel(rule: OpeningHoursRule): string {
  return `${rule.opensAt}–${rule.closesAt}`;
}
function isSameWindow(rule: OpeningHoursRule, day: OpeningDay, minutes: number) {
  if (!rule.days.includes(day)) return false;

  const open = parseClock(rule.opensAt);
  const close = parseClock(rule.closesAt);
  if (open === null || close === null) return null;

  if (open === close) {
    return { open, close: open + 24 * 60, minutes };
  }

  if (close > open) {
    if (minutes >= open && minutes < close) return { open, close, minutes };
    return null;
  }

  if (minutes >= open) return { open, close: close + 24 * 60, minutes };
  return null;
}

function isPreviousOvernightWindow(rule: OpeningHoursRule, date: Date, minutes: number) {
  const previousDay = getDayOffset(date, -1);
  if (!rule.days.includes(previousDay)) return false;

  const open = parseClock(rule.opensAt);
  const close = parseClock(rule.closesAt);
  if (open === null || close === null || close >= open) return null;

  if (minutes < close) return { open: open - 24 * 60, close, minutes };
  return null;
}

function findNextOpening(rules: OpeningHoursRule[], now: Date) {
  const currentMinutes = getMinutesOfDay(now);

  for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
    const day = getDayOffset(now, dayOffset);
    const dayBase = dayOffset * 24 * 60;
    const candidates = rules
      .filter((rule) => rule.days.includes(day))
      .map((rule) => {
        const open = parseClock(rule.opensAt);
        const close = parseClock(rule.closesAt);
        if (open === null || close === null) return null;
        const absoluteOpen = dayBase + open;
        return { rule, absoluteOpen };
      })
      .filter(Boolean) as Array<{ rule: OpeningHoursRule; absoluteOpen: number }>;

    const next = candidates
      .filter((candidate) => candidate.absoluteOpen > currentMinutes)
      .sort((a, b) => a.absoluteOpen - b.absoluteOpen)[0];

    if (next) {
      const minutesUntilOpen = next.absoluteOpen - currentMinutes;
      return {
        rule: next.rule,
        minutesUntilOpen,
        time: formatClock(next.absoluteOpen),
        dayLabel: dayOffset === 0 ? "Today" : DAY_LABELS[day],
      };
    }
  }

  return null;
}

export function getLiveOpenStatus(metadata: OpeningHoursMetadata, now = new Date()): LiveOpenStatus {
  const rules = metadata.openingHoursRules ?? [];

  if (rules.length === 0) {
    return {
      state: "unknown",
      label: "Hours need check",
      detail: metadata.openingHoursNote ?? metadata.openingHours ?? "Confirm live hours before visiting.",
    };
  }

  const currentDay = getDayOffset(now, 0);
  const minutes = getMinutesOfDay(now);

  for (const rule of rules) {
    const sameWindow = isSameWindow(rule, currentDay, minutes) || isPreviousOvernightWindow(rule, now, minutes);
    if (!sameWindow) continue;

    const minutesUntilClose = sameWindow.close - sameWindow.minutes;
    const state: LiveOpenState = minutesUntilClose <= CLOSING_SOON_MINUTES ? "closing-soon" : "open";
    return {
      state,
      label: state === "closing-soon" ? "Closing soon" : "Open now",
      detail: state === "closing-soon" ? "Closes soon" : "Open until",
      nextTime: formatClock(sameWindow.close),
      windowLabel: getWindowLabel(rule),
    };
  }

  const nextOpening = findNextOpening(rules, now);
  if (!nextOpening) {
    return {
      state: "unknown",
      label: "Hours need check",
      detail: metadata.openingHoursNote ?? "Confirm live hours before visiting.",
    };
  }

  const opensSoon = nextOpening.minutesUntilOpen <= OPENS_SOON_MINUTES;

  return {
    state: opensSoon ? "opens-soon" : "closed",
    label: opensSoon ? "Opens soon" : "Closed now",
    detail: nextOpening.dayLabel === "Today" ? "Opens at" : "Next open",
    nextTime: nextOpening.time,
    nextDayLabel: nextOpening.dayLabel === "Today" ? undefined : nextOpening.dayLabel,
    windowLabel: getWindowLabel(nextOpening.rule),
  };
}
