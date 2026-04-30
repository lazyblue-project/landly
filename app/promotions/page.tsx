"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarPlus2, Heart, Megaphone, Tickets, TimerReset } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { promotionEvents } from "@/data/promo-events";
import { useAppStore } from "@/store/app-store";
import { PromotionAudience, PromotionEvent } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { PromotionPersonaLanes } from "@/components/promotions/promotion-persona-lanes";
import { PartnerOfferCommandCenter } from "@/components/partners/partner-offer-command-center";

const filters = [{ id: "all", label: "All" }, { id: "live", label: "Now" }, { id: "upcoming", label: "Upcoming" }] as const;

function PromotionCard({ event, interested, saved, booked, onToggleInterest, onToggleSave, onToggleBooked }: { event: PromotionEvent; interested: boolean; saved: boolean; booked: boolean; onToggleInterest: () => void; onToggleSave: () => void; onToggleBooked: () => void; }) {
  const { lt } = useLocalizedText();
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${event.status === "live" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{lt(event.status === "live" ? "Live now" : "Upcoming")}</span>
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">{lt(event.category)}</span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">{lt(event.sourceType === "internal" ? "Landly pick" : "Partner / external")}</span>
          </div>
          <p className="mt-3 text-base font-semibold text-gray-900">{lt(event.title)}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt(event.description)}</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl bg-gray-50 p-3 text-xs text-gray-600">
        <p><span className="font-semibold text-gray-900">{lt("When:")}</span> {event.startDate}{event.endDate && event.endDate !== event.startDate ? ` → ${event.endDate}` : ""}</p>
        <p className="mt-1"><span className="font-semibold text-gray-900">{lt("Where:")}</span> {lt(event.location ?? event.city)}</p>
        <p className="mt-1"><span className="font-semibold text-gray-900">{lt("City:")}</span> {lt(event.city)}</p>
      </div>
      <div className="mt-3 rounded-2xl bg-violet-50 p-3 text-xs leading-relaxed text-violet-800">
        <p className="font-semibold">{lt("Why this is useful")}</p>
        <p className="mt-1">{lt(event.benefit)}</p>
      </div>
      <div className="mt-3 rounded-2xl bg-gray-50 p-3">
        <p className="text-xs font-semibold text-gray-900">{lt("Before you go")}</p>
        <ul className="mt-2 space-y-1">{event.checklist.map((item) => <li key={item} className="text-xs leading-relaxed text-gray-600">• {lt(item)}</li>)}</ul>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {event.audience.map((audience) => <span key={audience} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">{lt(audience)}</span>)}
        {event.tags.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">#{lt(tag)}</span>)}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2">
        <button type="button" onClick={onToggleInterest} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${interested ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700"}`}><Heart size={16} /> {lt(interested ? "Interested" : "Register interest")}</button>
        <button type="button" onClick={onToggleSave} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${saved ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-700"}`}><CalendarPlus2 size={16} /> {lt(saved ? "In calendar" : "Save schedule")}</button>
        <button type="button" onClick={onToggleBooked} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${booked ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}><Tickets size={16} /> {lt(booked ? "Reserved" : "Reserve / book")}</button>
      </div>
      {event.bookingLink ? <div className="mt-3"><Link href={event.bookingLink} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-700 underline underline-offset-4">{lt("Open official booking / event page")}</Link></div> : null}
    </div>
  );
}

export default function PromotionsPage() {
  const { hasHydrated, interestedPromotionIds, savedPromotionIds, bookedPromotionIds, togglePromotionInterest, toggleSavedPromotion, toggleBookedPromotion, addCalendarEvent, removeCalendarEvent, calendarEvents } = useAppStore();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [audienceFilter, setAudienceFilter] = useState<"all" | PromotionAudience>("all");
  const { lt } = useLocalizedText();
  const visibleEvents = useMemo(() => promotionEvents.filter((event) => {
    const statusMatched = filter === "all" || event.status === filter;
    const audienceMatched = audienceFilter === "all" || event.audience.includes(audienceFilter);
    return statusMatched && audienceMatched;
  }), [filter, audienceFilter]);
  const liveCount = promotionEvents.filter((event) => event.status === "live").length;
  const upcomingCount = promotionEvents.filter((event) => event.status === "upcoming").length;
  const handleToggleSchedule = (event: PromotionEvent) => { const calendarId = `promo_${event.id}`; const alreadySaved = savedPromotionIds.includes(event.id); if (alreadySaved) { toggleSavedPromotion(event.id); removeCalendarEvent(calendarId); return; } toggleSavedPromotion(event.id); addCalendarEvent({ id: calendarId, title: event.title, date: event.startDate, category: "promo", location: event.location ?? event.city, note: event.description, sourceHref: "/promotions" }); };
  const calendarPromoCount = calendarEvents.filter((event) => event.category === "promo").length;
  if (!hasHydrated) return <AppShell><TopBar title={lt("Promotions")} showBack /><div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-gray-500">{lt("Preparing events and bookings…")}</div></AppShell>;

  return (
    <AppShell>
      <TopBar title={lt("Promotions")} showBack />
      <div className="space-y-4 px-4 py-4">
        <section className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 shadow-sm ring-1 ring-violet-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100"><Megaphone size={13} /> {lt("Events, promos, and upcoming picks")}</div>
              <p className="mt-3 text-lg font-semibold text-gray-900">{lt("Keep outside requests and Landly-curated events in one place")}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Use this space to register interest, save dates, and keep booking-related actions organized without losing context.")}</p>
            </div>
            <TimerReset className="mt-1 text-violet-500" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Live")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{liveCount}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Upcoming")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{upcomingCount}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Saved")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{calendarPromoCount}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Reserved")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{bookedPromotionIds.length}</p></div>
          </div>
        </section>
        <PromotionPersonaLanes events={promotionEvents} value={audienceFilter} onChange={setAudienceFilter} />
        <PartnerOfferCommandCenter compact category="experience" />
        <div className="flex gap-2 overflow-x-auto pb-1">{filters.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === item.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>{lt(item.label)}</button>)}</div>
        <section className="space-y-3">
          {visibleEvents.length === 0 ? <div className="rounded-3xl border border-gray-100 bg-white p-5 text-sm leading-relaxed text-gray-500 shadow-sm">{lt("No events match this lane yet. Switch lanes or save a custom calendar plan from My.")}</div> : null}
          {visibleEvents.map((event) => <PromotionCard key={event.id} event={event} interested={interestedPromotionIds.includes(event.id)} saved={savedPromotionIds.includes(event.id)} booked={bookedPromotionIds.includes(event.id)} onToggleInterest={() => togglePromotionInterest(event.id)} onToggleSave={() => handleToggleSchedule(event)} onToggleBooked={() => toggleBookedPromotion(event.id)} />)}
        </section>
      </div>
    </AppShell>
  );
}
