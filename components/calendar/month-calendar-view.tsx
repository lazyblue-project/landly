"use client";

import { useMemo, useState } from "react";
import { CalendarEvent } from "@/types";
import { ChevronLeft, ChevronRight, MapPinned, Plus, Trash2 } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

interface MonthCalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onRemoveEvent: (id: string) => void;
}

function formatDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function sameDay(a: string, b: string) { return a === b; }

export function MonthCalendarView({ events, onAddEvent, onRemoveEvent }: MonthCalendarViewProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const { lt } = useLocalizedText();

  const monthDays = useMemo(() => {
    const year = visibleMonth.getFullYear(); const month = visibleMonth.getMonth(); const first = new Date(year, month, 1); const last = new Date(year, month + 1, 0); const leading = first.getDay(); const total = last.getDate();
    const cells: Array<{ key: string; date: string | null; day: number | null }> = [];
    for (let index = 0; index < leading; index += 1) cells.push({ key: `empty-start-${index}`, date: null, day: null });
    for (let day = 1; day <= total; day += 1) { const date = formatDate(new Date(year, month, day)); cells.push({ key: date, date, day }); }
    while (cells.length % 7 !== 0) cells.push({ key: `empty-end-${cells.length}`, date: null, day: null });
    return cells;
  }, [visibleMonth]);

  const selectedEvents = useMemo(() => events.filter((event) => sameDay(event.date, selectedDate)).sort((a, b) => a.title.localeCompare(b.title)), [events, selectedDate]);
  const addManualEvent = () => { if (draftTitle.trim() === "") return; onAddEvent({ id: `manual_${Date.now()}`, title: draftTitle.trim(), date: selectedDate, category: "task", note: draftNote.trim() || undefined }); setDraftTitle(""); setDraftNote(""); };
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-sm font-semibold text-gray-900">{visibleMonth.toLocaleDateString(undefined, { year: "numeric", month: "long" })}</p><p className="mt-1 text-xs text-gray-500">{lt("Saved arrival plans and custom events show up on their actual dates.")}</p></div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"><ChevronLeft size={16} /></button><button type="button" onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"><ChevronRight size={16} /></button></div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">{weekdays.map((label) => <div key={label}>{lt(label)}</div>)}</div>
        <div className="mt-3 grid grid-cols-7 gap-2">{monthDays.map((cell) => { const dayEvents = cell.date ? events.filter((event) => event.date === cell.date) : []; const isSelected = cell.date === selectedDate; return <button key={cell.key} type="button" onClick={() => cell.date && setSelectedDate(cell.date)} className={["min-h-[72px] rounded-2xl border p-2 text-left align-top transition-colors", cell.date ? "border-gray-100 bg-gray-50 hover:bg-gray-100" : "border-transparent bg-transparent", isSelected ? "ring-2 ring-sky-300" : ""].join(" ")} disabled={!cell.date}>{cell.day ? <p className="text-xs font-semibold text-gray-800">{cell.day}</p> : null}{dayEvents.length > 0 ? <div className="mt-2 flex flex-wrap gap-1">{dayEvents.slice(0, 3).map((event) => <span key={event.id} className="h-2 w-2 rounded-full bg-sky-500" />)}{dayEvents.length > 3 ? <span className="text-[10px] text-gray-400">+{dayEvents.length - 3}</span> : null}</div> : null}</button>; })}</div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-gray-900">{new Date(selectedDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</p><p className="mt-1 text-xs text-gray-500">{lt("Review saved route plans or add your own event for this date.")}</p></div><span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">{selectedEvents.length} {lt("items")}</span></div>
        <div className="mt-4 space-y-3">{selectedEvents.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">{lt("No events on this day yet.")}</div> : selectedEvents.map((event) => <div key={event.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-gray-900">{lt(event.title)}</p>{event.location ? <p className="mt-1 text-xs text-gray-500">{lt(event.location)}</p> : null}{event.note ? <p className="mt-2 text-xs leading-relaxed text-gray-600">{lt(event.note)}</p> : null}</div><button type="button" onClick={() => onRemoveEvent(event.id)} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100" aria-label={lt("Remove")}><Trash2 size={14} /></button></div>{(event.googleMapsUrl || event.naverMapUrl) ? <div className="mt-3 flex flex-wrap gap-2">{event.googleMapsUrl ? <a href={event.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-700 ring-1 ring-sky-100"><MapPinned size={12} /> {lt("Google Maps")}</a> : null}{event.naverMapUrl ? <a href={event.naverMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"><MapPinned size={12} /> {lt("NAVER Map")}</a> : null}</div> : null}</div>)}</div>
        <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Plus size={16} className="text-sky-600" /> {lt("Add custom event")}</div><div className="mt-3 space-y-2"><input type="text" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder={lt("Example: Pick up SIM card")} className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none" /><textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} placeholder={lt("Optional note")} rows={3} className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none" /><button type="button" onClick={addManualEvent} className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700">{lt("Save on")} {selectedDate}</button></div></div>
      </section>
    </div>
  );
}
