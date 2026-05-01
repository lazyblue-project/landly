"use client";

import Link from "next/link";
import { CalendarDays, FileText, Home, ShieldCheck } from "lucide-react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { LifeChecklist } from "@/components/life/life-checklist";
import { lifeChecklist } from "@/data/life-checklist";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

const quickLinks = [
  {
    href: "/stay?tab=plan",
    title: "Build settlement plan",
    description: "Turn your stay type and housing status into immediate tasks.",
    icon: Home,
  },
  {
    href: "/stay?tab=documents",
    title: "Open document vault",
    description: "Keep ARC, contract, insurance, and school or work files ready.",
    icon: FileText,
  },
  {
    href: "/calendar",
    title: "Add deadline reminders",
    description: "Move appointments, renewals, and housing dates into Calendar.",
    icon: CalendarDays,
  },
];

export default function LifePage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const completedChecklistIds = useAppStore((state) => state.user.completedChecklistIds);
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Life Checklist")} />
        <PageSkeleton />
      </AppShell>
    );
  }

  const completedCount = completedChecklistIds.length;
  const totalCount = lifeChecklist.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);
  const nextItem = lifeChecklist.find((item) => !completedChecklistIds.includes(item.id));

  return (
    <AppShell>
      <TopBar title={lt("Life Checklist")} />
      <div className="space-y-4 px-4 py-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-gray-900">{lt("Your Korea setup checklist")}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {lt("Track registration, phone, banking, health insurance, housing, school, work, tax, and support steps in one place.")}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-50 px-3 py-2 text-center">
              <p className="text-[11px] text-gray-500">{lt("Done")}</p>
              <p className="mt-0.5 text-sm font-bold text-gray-900">{completedCount}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2 text-center">
              <p className="text-[11px] text-gray-500">{lt("Total")}</p>
              <p className="mt-0.5 text-sm font-bold text-gray-900">{totalCount}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center">
              <p className="text-[11px] text-emerald-700">{lt("Progress")}</p>
              <p className="mt-0.5 text-sm font-bold text-emerald-800">{completionRate}%</p>
            </div>
          </div>

          {nextItem ? (
            <div className="mt-4 rounded-2xl bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-900">{lt("Recommended next")}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{lt(nextItem.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-800">{lt(nextItem.description)}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              {lt("All core life setup items are complete.")}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-transform active:scale-[0.98]">
                <div className="rounded-2xl bg-gray-50 p-2 text-gray-700">
                  <Icon size={17} />
                </div>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900">{lt(item.title)}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-500">{lt(item.description)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <LifeChecklist />
    </AppShell>
  );
}
