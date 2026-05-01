"use client";

import Link from "next/link";
import { BarChart3, FlaskConical, MessageSquarePlus, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { moreMenuSections } from "@/data/more-menu";
import { isBetaToolsEnabled, isPartnerOffersEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "mailto:hwani.project@gmail.com?subject=Landly%20Feedback";

export default function MorePage() {
  const { lt } = useLocalizedText();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const isBetaTester = useAppStore((state) => state.isBetaTester);
  const showBetaTools = isBetaToolsEnabled(isBetaTester);
  const showPartnerOffers = isPartnerOffersEnabled(isBetaTester);

  if (!hasHydrated) return <PageSkeleton />;

  return (
    <AppShell>
      <TopBar title={lt("More")} />
      <div className="space-y-5 px-4 py-4">
        {moreMenuSections.map((section) => {
          const visibleItems = section.items.filter((item) => showPartnerOffers || item.href !== "/partners");
          if (visibleItems.length === 0) return null;

          return (
            <section key={section.title} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-gray-900">{lt(section.title)}</p>
                <p className="mt-1 text-xs text-gray-500">{lt(section.description)}</p>
              </div>
              <div className="mt-4 space-y-3">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
                      <div className="rounded-2xl bg-white p-2 text-sky-600 shadow-sm"><Icon size={18} /></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{lt(item.label)}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{lt(item.description)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {showBetaTools ? (
          <section className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm">
            <p className="text-sm font-semibold text-violet-900">{lt("Beta Tester")}</p>
            <p className="mt-1 text-xs text-violet-600">{lt("Try key testing scenarios quickly or leave feedback.")}</p>
            <div className="mt-4 space-y-3">
              <Link href="/test" className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 transition-colors hover:bg-violet-50">
                <div className="rounded-2xl bg-violet-100 p-2 text-violet-600 shadow-sm"><FlaskConical size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lt("Quick Test Guide")}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{lt("Open key feature testing scenarios")}</p>
                </div>
              </Link>
              <Link href="/admin" className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 transition-colors hover:bg-violet-50">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700 shadow-sm"><BarChart3 size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lt("Operator Insights")}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{lt("Review beta signals and export an operator snapshot")}</p>
                </div>
              </Link>
              <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 transition-colors hover:bg-violet-50">
                <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-600 shadow-sm"><MessageSquarePlus size={18} /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{lt("Send Feedback")}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{lt("Submit bug, UX, or translation feedback")}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </a>
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
