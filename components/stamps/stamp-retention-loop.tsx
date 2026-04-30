"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Flame, Sparkles } from "lucide-react";
import { officialStampGoals } from "@/data/stamp-catalog";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

function getLevelLabel(completedCount: number) {
  if (completedCount >= 12) return "Korea routine builder";
  if (completedCount >= 8) return "Confident local explorer";
  if (completedCount >= 4) return "Active Korea starter";
  return "First loop starter";
}

export function StampRetentionLoop() {
  const { customStampGoals, completedStampGoalIds, receiptRecords, savedCareProviderIds, savedShopStoreIds, user } = useAppStore();
  const { lt } = useLocalizedText();
  const allGoals = [...officialStampGoals, ...customStampGoals];
  const completedCount = allGoals.filter((goal) => completedStampGoalIds.includes(goal.id)).length;
  const totalPoints = allGoals.filter((goal) => completedStampGoalIds.includes(goal.id)).reduce((sum, goal) => sum + goal.points, 0);
  const nextGoals = officialStampGoals
    .filter((goal) => !completedStampGoalIds.includes(goal.id))
    .sort((a, b) => {
      const priorityA = getGoalPriority(a.id, { receipts: receiptRecords.length, care: savedCareProviderIds.length, shops: savedShopStoreIds.length, phrases: user.savedPhraseIds.length });
      const priorityB = getGoalPriority(b.id, { receipts: receiptRecords.length, care: savedCareProviderIds.length, shops: savedShopStoreIds.length, phrases: user.savedPhraseIds.length });
      return priorityB - priorityA;
    })
    .slice(0, 3);

  return (
    <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
            <Flame size={13} />
            {lt("Retention loop")}
          </div>
          <p className="mt-3 text-base font-semibold text-gray-900">{lt("Turn useful actions into small wins")}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Stamps now connect back to Pass, Shop, Care, Stay, and Assistant so users always have a next step.")}</p>
        </div>
        <Sparkles className="mt-1 shrink-0 text-amber-500" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100">
          <p className="text-[10px] font-medium text-gray-500">{lt("Level")}</p>
          <p className="mt-1 text-xs font-semibold text-gray-900">{lt(getLevelLabel(completedCount))}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100">
          <p className="text-[10px] font-medium text-gray-500">{lt("Wins")}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{completedCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100">
          <p className="text-[10px] font-medium text-gray-500">{lt("Points")}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{totalPoints}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {nextGoals.map((goal) => (
          <Link key={goal.id} href={goal.href ?? "/stamps"} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-gray-100 transition-colors hover:bg-gray-50">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BadgeCheck size={13} className="text-sky-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">{lt(goal.category)}</span>
                <span className="text-[11px] text-gray-400">+{goal.points} pt</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">{lt(goal.title)}</p>
              {goal.nudge ? <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{lt(goal.nudge)}</p> : null}
            </div>
            <ArrowRight size={15} className="shrink-0 text-gray-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function getGoalPriority(id: string, state: { receipts: number; care: number; shops: number; phrases: number }) {
  if (id === "stamp_shopping_receipt" && state.receipts > 0) return 10;
  if (id === "stamp_care_provider" && state.care > 0) return 9;
  if (id === "stamp_shopping_route" && state.shops > 0) return 8;
  if (id === "stamp_culture_phrase" && state.phrases > 0) return 7;
  if (id === "stamp_arrival_72h") return 6;
  return 1;
}
