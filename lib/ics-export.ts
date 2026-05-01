import type { CalendarEvent } from "@/types";

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toUtcStamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function toIcsDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return "";
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
}

function addOneDay(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return dateString;
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function getEventUrl(event: CalendarEvent) {
  return event.sourceHref ?? event.googleMapsUrl ?? event.naverMapUrl;
}

export function buildIcsCalendar(events: CalendarEvent[], options?: { calendarName?: string }) {
  const now = toUtcStamp();
  const calendarName = options?.calendarName ?? "Landly Calendar";
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Landly//Calendar Export v48//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
  ];

  sortedEvents.forEach((event) => {
    const startDate = toIcsDate(event.date);
    const endDate = toIcsDate(addOneDay(event.date));
    if (!startDate || !endDate) return;

    const descriptionParts = [
      event.note,
      event.transportType ? `Transport: ${event.transportType}` : undefined,
      event.sourceHref ? `Related step: ${event.sourceHref}` : undefined,
      event.googleMapsUrl ? `Google Maps: ${event.googleMapsUrl}` : undefined,
      event.naverMapUrl ? `NAVER Map: ${event.naverMapUrl}` : undefined,
    ].filter(Boolean);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${escapeIcsText(event.id)}@landly.local`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      `CATEGORIES:${escapeIcsText(event.category)}`
    );

    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    }

    if (descriptionParts.length > 0) {
      lines.push(`DESCRIPTION:${escapeIcsText(descriptionParts.join("\n"))}`);
    }

    const url = getEventUrl(event);
    if (url) {
      lines.push(`URL:${escapeIcsText(url)}`);
    }

    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");

  return `${lines.join("\r\n")}\r\n`;
}

export function downloadIcsCalendar(events: CalendarEvent[], fileName = "landly-calendar.ics") {
  const ics = buildIcsCalendar(events);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
