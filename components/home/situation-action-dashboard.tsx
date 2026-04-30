"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeHelp,
  CalendarClock,
  HeartPulse,
  Languages,
  PlaneLanding,
  ReceiptText,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";
import { OnboardingNeed, UserProfile } from "@/types";

interface SituationAction {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  icon: typeof PlaneLanding;
  tone: "sky" | "emerald" | "rose" | "amber" | "violet" | "slate";
  needs: OnboardingNeed[];
  modes: Array<UserProfile["mode"]>;
}

const toneClass: Record<SituationAction["tone"], string> = {
  sky: "border-sky-100 bg-sky-50 text-sky-700 ring-sky-100",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "border-rose-100 bg-rose-50 text-rose-700 ring-rose-100",
  amber: "border-amber-100 bg-amber-50 text-amber-700 ring-amber-100",
  violet: "border-violet-100 bg-violet-50 text-violet-700 ring-violet-100",
  slate: "border-slate-100 bg-slate-50 text-slate-700 ring-slate-100",
};

const actions: SituationAction[] = [
  {
    id: "arrival-now",
    title: "I just arrived in Korea",
    description: "Choose airport rail, bus, taxi, map apps, and your first 72-hour checklist.",
    href: "/pass?tab=arrival",
    badge: "Start after landing",
    icon: PlaneLanding,
    tone: "sky",
    needs: ["airport_transport"],
    modes: ["travel", "life"],
  },
  {
    id: "refund-now",
    title: "I need a tax refund check",
    description: "Check eligibility before checkout, then keep receipts ready for departure.",
    href: "/shop/checker",
    badge: "Before you pay",
    icon: ReceiptText,
    tone: "emerald",
    needs: ["shopping_refund"],
    modes: ["travel"],
  },
  {
    id: "care-now",
    title: "I feel sick or need a pharmacy",
    description: "Check urgency, find care options, and prepare Korean phrases for staff.",
    href: "/care?tab=overview",
    badge: "Care path",
    icon: HeartPulse,
    tone: "rose",
    needs: ["hospital_pharmacy"],
    modes: ["travel", "life"],
  },
  {
    id: "sos-now",
    title: "I lost something or need urgent help",
    description: "Open 112, 119, 1330, lost-item help, and emergency phrase flows.",
    href: "/sos",
    badge: "Safety first",
    icon: ShieldAlert,
    tone: "amber",
    needs: ["emergency_help"],
    modes: ["travel", "life"],
  },
  {
    id: "phrase-now",
    title: "I need to say something in Korean",
    description: "Open taxi, restaurant, shopping, hospital, and emergency phrase sets.",
    href: "/assistant",
    badge: "Show to staff",
    icon: Languages,
    tone: "violet",
    needs: ["korean_phrases"],
    modes: ["travel", "life"],
  },
  {
    id: "stay-now",
    title: "I am staying longer than a trip",
    description: "Start your 90-day plan for ARC, phone, banking, housing, and documents.",
    href: "/stay?tab=first90",
    badge: "Long-stay setup",
    icon: CalendarClock,
    tone: "slate",
    needs: ["long_stay_setup"],
    modes: ["life"],
  },
];

function getPriorityScore(action: SituationAction, user: UserProfile): number {
  let score = 0;

  if (user.firstNeed && action.needs.includes(user.firstNeed)) score += 100;
  if (action.modes.includes(user.mode)) score += 20;
  if (user.mode === "life" && action.id === "stay-now") score += 30;
  if (user.mode === "travel" && action.id === "arrival-now") score += 25;
  if (user.stayDuration === "over_3months" && action.id === "stay-now") score += 35;

  return score;
}

function getSituationActions(user: UserProfile): SituationAction[] {
  const modeMatched = actions.filter((action) => action.modes.includes(user.mode));
  const fallback = user.mode === "travel"
    ? actions.filter((action) => action.id !== "stay-now")
    : modeMatched;

  return [...fallback]
    .sort((a, b) => getPriorityScore(b, user) - getPriorityScore(a, user))
    .slice(0, 5);
}

export function SituationActionDashboard() {
  const { user } = useAppStore();
  const { lt } = useLocalizedText();
  const visibleActions = getSituationActions(user);
  const primaryAction = visibleActions[0];
  const restActions = visibleActions.slice(1);
  const PrimaryIcon = primaryAction.icon;

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-100">
              <Sparkles size={13} />
              {lt("Situation-first home")}
            </div>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">{lt("What do you need now?")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("Start from your real situation, then Landly opens the right route, phrase, checklist, or saved plan.")}
            </p>
          </div>
        </div>

        <Link
          href={primaryAction.href}
          className="mt-4 flex items-center gap-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-sky-500 p-4 text-white shadow-sm transition-transform active:scale-[0.99]"
        >
          <div className="shrink-0 rounded-2xl bg-white/15 p-3 ring-1 ring-white/20">
            <PrimaryIcon size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">{lt("Recommended first")}</p>
            <p className="mt-1 text-base font-bold leading-snug">{lt(primaryAction.title)}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-blue-50">{lt(primaryAction.description)}</p>
          </div>
          <ArrowRight size={17} className="shrink-0" />
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {restActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.id}
                href={action.href}
                className="rounded-3xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={cn("rounded-2xl border p-2 ring-1", toneClass[action.tone])}>
                    <Icon size={17} />
                  </div>
                  <ArrowRight size={14} className="text-gray-300" />
                </div>
                <p className="mt-3 text-[11px] font-semibold text-blue-700">{lt(action.badge)}</p>
                <p className="mt-1 text-sm font-bold leading-snug text-gray-900">{lt(action.title)}</p>
              </Link>
            );
          })}
        </div>

        <Link
          href="/my"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <BadgeHelp size={16} className="text-blue-600" />
          <span className="flex-1">{lt("Saved plans, reminders, receipts, and documents stay in My.")}</span>
          <ArrowRight size={14} className="text-gray-300" />
        </Link>
      </div>
    </section>
  );
}
