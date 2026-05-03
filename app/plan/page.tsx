"use client";

import Link from "next/link";
import { ClipboardCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import { BetaPatchPlannerDashboard } from "@/components/admin/beta-patch-planner-dashboard";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { isPlanToolsEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

export default function PlanPage() {
  const { lt } = useLocalizedText();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const isBetaTester = useAppStore((state) => state.isBetaTester);
  const setBetaTester = useAppStore((state) => state.setBetaTester);
  const showPlanTools = isPlanToolsEnabled(isBetaTester);

  if (!hasHydrated) {
    return <AppShell><TopBar title={lt("Patch Plan")} showBack /><PageSkeleton /></AppShell>;
  }

  return (
    <AppShell>
      <TopBar title={lt("Patch Plan")} showBack />
      {showPlanTools ? <BetaPatchPlannerDashboard /> : (
        <div className="px-4 py-4">
          <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-gray-900">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"><LockKeyhole size={20} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{lt("Guarded tool")}</p>
                <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-gray-50">{lt("Patch planning tools are hidden for general users")}</h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{lt("Enable beta tester mode on this device or set NEXT_PUBLIC_ENABLE_PLAN_TOOLS=true to turn triage signals into concrete patch tasks.")}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setBetaTester(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99] dark:bg-white dark:text-gray-950"><ShieldCheck size={16} />{lt("Enable beta tester mode")}</button>
              <Link href="/triage" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 active:scale-[0.99] dark:border-gray-700 dark:text-gray-100"><ClipboardCheck size={16} />{lt("Open Triage Board")}</Link>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
