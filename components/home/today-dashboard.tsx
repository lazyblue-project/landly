"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  FileClock,
  HeartPulse,
  MessageSquareText,
  PlaneLanding,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useReminderEngine } from "@/hooks/use-reminder-engine";
import { useLocalizedText } from "@/lib/text-localizer";
import { OnboardingNeed, UserProfile } from "@/types";

interface TodayAction {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  tone: "sky" | "emerald" | "rose" | "amber" | "violet";
  icon: typeof PlaneLanding;
}

const toneClasses: Record<TodayAction["tone"], string> = {
  sky: "border-sky-100 bg-sky-50 text-sky-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
};

function getWeatherSnapshot(city: string) {
  const month = new Date().getMonth();

  if (month >= 11 || month <= 1) return { summary: "Cold and dry", temperature: "1°–6°C" };
  if (month >= 5 && month <= 7) return { summary: "Warm with humidity", temperature: "23°–30°C" };
  return { summary: city === "Busan" ? "Comfortable seaside weather" : city === "Jeju" ? "Mild with breeze" : "Comfortable city weather", temperature: "12°–22°C" };
}

function createNeedAction(need: OnboardingNeed): TodayAction {
  const actions: Record<OnboardingNeed, TodayAction> = {
    airport_transport: {
      id: "need_airport_transport",
      title: "Choose your airport route",
      description: "Compare rail, bus, taxi, and first-72-hour arrival steps before you move.",
      href: "/pass?tab=arrival",
      badge: "Start here",
      tone: "sky",
      icon: PlaneLanding,
    },
    shopping_refund: {
      id: "need_shopping_refund",
      title: "Check tax refund before shopping",
      description: "Open the refund checker, save receipts, and keep departure steps together.",
      href: "/shop/checker",
      badge: "Money saver",
      tone: "emerald",
      icon: ShoppingBag,
    },
    hospital_pharmacy: {
      id: "need_hospital_pharmacy",
      title: "Prepare clinic or pharmacy help",
      description: "Find care options and keep the right Korean phrases ready before you go.",
      href: "/care?tab=overview",
      badge: "Care ready",
      tone: "rose",
      icon: HeartPulse,
    },
    korean_phrases: {
      id: "need_korean_phrases",
      title: "Save your essential Korean phrases",
      description: "Open taxi, restaurant, shopping, and emergency phrases you can show quickly.",
      href: "/assistant",
      badge: "Communication",
      tone: "violet",
      icon: MessageSquareText,
    },
    long_stay_setup: {
      id: "need_long_stay_setup",
      title: "Set up your first 90 days",
      description: "Start the long-stay checklist for registration, banking, phone, housing, and health.",
      href: "/stay?tab=first90",
      badge: "Life setup",
      tone: "emerald",
      icon: FileClock,
    },
    emergency_help: {
      id: "need_emergency_help",
      title: "Save emergency help first",
      description: "Keep 112, 119, 1330, urgent phrases, and SOS flows within one tap.",
      href: "/sos",
      badge: "Safety first",
      tone: "amber",
      icon: ShieldAlert,
    },
  };

  return actions[need];
}

function getDefaultNeed(user: UserProfile): OnboardingNeed {
  if (user.mode === "life" || user.stayDuration === "over_3months") {
    return "long_stay_setup";
  }

  return "airport_transport";
}

function getPersonalizedActions(user: UserProfile): TodayAction[] {
  const primaryNeed = user.firstNeed ?? getDefaultNeed(user);
  const baseActions: TodayAction[] = user.mode === "life"
    ? [
        createNeedAction("long_stay_setup"),
        {
          id: "life_official_help",
          title: "Save official support routes",
          description: "Keep immigration, care, and daily-life help close before you need it.",
          href: "/stay?tab=guides",
          badge: "Official links",
          tone: "violet",
          icon: CheckCircle2,
        },
        createNeedAction("hospital_pharmacy"),
        createNeedAction("korean_phrases"),
      ]
    : [
        createNeedAction("airport_transport"),
        createNeedAction("korean_phrases"),
        createNeedAction("shopping_refund"),
        createNeedAction("emergency_help"),
      ];

  const ordered = [createNeedAction(primaryNeed), ...baseActions];
  return ordered.filter((action, index, arr) => arr.findIndex((item) => item.id === action.id) === index).slice(0, 3);
}

export function TodayDashboard() {
  const { user, calendarEvents } = useAppStore();
  const { summary } = useReminderEngine();
  const { lt } = useLocalizedText();
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = calendarEvents.filter((event) => event.date === today).slice(0, 2);
  const weather = getWeatherSnapshot(user.city);
  const actions = getPersonalizedActions(user);

  return (
    <section className="space-y-3 px-4 pt-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{lt("Today in Korea")}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{lt("Your next 3 actions")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {lt("Personalized from your purpose, stay length, and first priority.")}
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100 active:scale-[0.99]"
              >
                <div className={`shrink-0 rounded-2xl border p-2 ${toneClasses[action.tone]}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-500 shadow-sm">
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-semibold text-blue-700">{lt(action.badge)}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-gray-900">{lt(action.title)}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{lt(action.description)}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-gray-400" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/calendar" className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm hover:bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{lt("Today")}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{lt("Calendar")}</p>
            </div>
            <CalendarDays size={18} className="text-sky-600" />
          </div>
          <div className="mt-4 space-y-2">
            {todayEvents.length === 0 ? <p className="text-sm text-gray-500">{lt("No saved plans yet. Tap to add or view events.")}</p> : todayEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-sky-50 px-3 py-2">
                <p className="text-xs font-semibold text-sky-900">{lt(event.title)}</p>
                {event.location ? <p className="mt-1 text-[11px] text-sky-700">{lt(event.location)}</p> : null}
              </div>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
            {lt("Open Calendar")} <ArrowRight size={14} />
          </div>
        </Link>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700/70">{lt("Today")}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{lt("Weather")}</p>
            </div>
            <CloudSun size={18} className="text-amber-600" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{weather.temperature}</p>
            <p className="mt-1 text-sm text-gray-700">{lt(user.city)}</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">{lt(weather.summary)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link href="/pass?tab=first72" className="rounded-3xl border border-sky-100 bg-sky-50 p-4 shadow-sm hover:bg-sky-100/60">
          <PlaneLanding size={18} className="text-sky-700" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt("Arrival 72h")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Fast-start checklist after landing.")}</p>
        </Link>
        <Link href="/stay?tab=first90" className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm hover:bg-emerald-100/60">
          <FileClock size={18} className="text-emerald-700" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt("Stay 90d")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Long-stay missions with less guesswork.")}</p>
        </Link>
        <Link href="/my" className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm hover:bg-violet-100/60">
          <BellRing size={18} className="text-violet-700" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt("Reminders")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{summary.dueSoon + summary.overdue} {lt("items need attention.")}</p>
        </Link>
      </div>
    </section>
  );
}
