"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BellRing, CalendarDays, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { ReminderItem } from "@/types";
import { useReminderEngine } from "@/hooks/use-reminder-engine";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const statusStyles = { upcoming: "bg-sky-50 text-sky-700 ring-sky-100", "due-soon": "bg-amber-50 text-amber-700 ring-amber-100", overdue: "bg-rose-50 text-rose-700 ring-rose-100", done: "bg-emerald-50 text-emerald-700 ring-emerald-100" } as const;

export function ReminderCenter() {
  const { allItems, summary } = useReminderEngine();
  const { addManualReminder, removeManualReminder, toggleReminderDone } = useAppStore();
  const { lt } = useLocalizedText();
  const [draft, setDraft] = useState({ title: "", dueDate: "", description: "", href: "" });
  const grouped = useMemo(() => ({ focus: allItems.filter((item) => item.status === "overdue" || item.status === "due-soon"), upcoming: allItems.filter((item) => item.status === "upcoming"), done: allItems.filter((item) => item.status === "done") }), [allItems]);

  const handleAdd = () => { if (draft.title.trim() === "") return; const reminder: ReminderItem = { id: `manual_${Date.now()}`, title: draft.title.trim(), dueDate: draft.dueDate || undefined, source: "manual", description: draft.description.trim() || undefined, href: draft.href.trim() || undefined }; addManualReminder(reminder); setDraft({ title: "", dueDate: "", description: "", href: "" }); };

  const renderItem = (item: (typeof allItems)[number]) => (
    <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => toggleReminderDone(item.id)} className="mt-0.5 text-emerald-600" aria-label={lt(item.status === "done" ? "Completed" : "Mark complete")}>{item.status === "done" ? <CheckCircle2 size={18} /> : <Circle size={18} />}</button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-gray-900">{lt(item.title)}</p><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusStyles[item.status]}`}>{lt(item.status)}</span></div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500"><span className="rounded-full bg-white px-2.5 py-1 uppercase tracking-wide">{lt(item.source.replace("-", " "))}</span>{item.dueDate ? <span className="rounded-full bg-white px-2.5 py-1">{item.dueDate}</span> : null}</div>
          {item.description ? <p className="mt-2 text-xs leading-relaxed text-gray-600">{lt(item.description)}</p> : null}
          {item.href ? <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">{lt("Open related page")}</Link> : null}
        </div>
        {item.source === "manual" ? <button type="button" onClick={() => removeManualReminder(item.id)} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100" aria-label={lt("Remove reminder")}><Trash2 size={14} /></button> : null}
      </div>
    </div>
  );

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div><div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700"><BellRing size={13} /> {lt("Reminder center")}</div><p className="mt-3 text-base font-semibold text-gray-900">{lt("Keep documents, saved plans, and deadlines in one review point")}</p><p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Manual reminders live together with document expiry, arrival plans, calendar events, and 30/90-day stay checkpoints.")}</p></div></div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-gray-50 p-3"><p className="text-[11px] text-gray-500">{lt("Total")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.total}</p></div><div className="rounded-2xl bg-amber-50 p-3"><p className="text-[11px] text-amber-700/80">{lt("Due soon")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.dueSoon}</p></div><div className="rounded-2xl bg-rose-50 p-3"><p className="text-[11px] text-rose-700/80">{lt("Overdue")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.overdue}</p></div><div className="rounded-2xl bg-emerald-50 p-3"><p className="text-[11px] text-emerald-700/80">{lt("Done")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.done}</p></div></div>
        <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Plus size={16} className="text-sky-600" /> {lt("Add manual reminder")}</div><div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"><input value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} className="rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none" placeholder={lt("Visit immigration office")} /><input type="date" value={draft.dueDate} onChange={(event) => setDraft((prev) => ({ ...prev, dueDate: event.target.value }))} className="rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none" /><input value={draft.href} onChange={(event) => setDraft((prev) => ({ ...prev, href: event.target.value }))} className="rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none sm:col-span-2" placeholder={lt("Optional internal link like /stay?tab=documents")} /><textarea value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} className="min-h-20 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none sm:col-span-2" placeholder={lt("What should you prepare, bring, or double-check?")} /></div><button type="button" onClick={handleAdd} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700"><CalendarDays size={16} /> {lt("Save reminder")}</button></div>
        <div className="mt-5 space-y-4"><div><p className="text-sm font-semibold text-gray-900">{lt("Needs attention")}</p><div className="mt-3 space-y-3">{grouped.focus.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">{lt("Nothing urgent right now.")}</div> : grouped.focus.map(renderItem)}</div></div><div><p className="text-sm font-semibold text-gray-900">{lt("Upcoming")}</p><div className="mt-3 space-y-3">{grouped.upcoming.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">{lt("No upcoming items yet.")}</div> : grouped.upcoming.map(renderItem)}</div></div><div><p className="text-sm font-semibold text-gray-900">{lt("Done")}</p><div className="mt-3 space-y-3">{grouped.done.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">{lt("Completed reminders will stay here for quick review.")}</div> : grouped.done.map(renderItem)}</div></div></div>
      </div>
    </section>
  );
}
