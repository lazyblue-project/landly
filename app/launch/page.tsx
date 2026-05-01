"use client";

import Link from "next/link";
import { LockKeyhole, Rocket, ShieldCheck } from "lucide-react";
import { BetaLaunchControlRoom } from "@/components/admin/beta-launch-control-room";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { isLaunchToolsEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

export default function LaunchPage() {
  const { lt } = useLocalizedText();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const isBetaTester = useAppStore((state) => state.isBetaTester);
  const setBetaTester = useAppStore((state) => state.setBetaTester);
  const showLaunchTools = isLaunchToolsEnabled(isBetaTester);

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Beta Launch")} showBack />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Beta Launch")} showBack />
      {showLaunchTools ? (
        <BetaLaunchControlRoom />
      ) : (
        <div className="px-4 py-4">
          <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm dark:border-sky-900 dark:bg-gray-900">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-sky-50 p-2 text-sky-700 ring-1 ring-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900">
                <LockKeyhole size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{lt("Guarded tool")}</p>
                <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-gray-50">{lt("Beta launch tools are hidden for general users")}</h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {lt("Enable beta tester mode on this device or set NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS=true to review launch readiness.")}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setBetaTester(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99] dark:bg-white dark:text-gray-950"
              >
                <ShieldCheck size={16} />
                {lt("Enable beta tester mode")}
              </button>
              <Link
                href="/trust"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 active:scale-[0.99] dark:border-gray-700 dark:text-gray-100"
              >
                <Rocket size={16} />
                {lt("Open Trust Center")}
              </Link>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
