"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, BadgePercent, CalendarDays, Gift, Sparkles } from "lucide-react";
import { promotionEvents } from "@/data/promo-events";
import { officialStampGoals } from "@/data/stamp-catalog";
import { partnerOffers } from "@/data/partner-offers";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export function RetentionLoopStrip() {
  const { completedStampGoalIds, interestedPromotionIds, savedPromotionIds, bookedPromotionIds, calendarEvents } = useAppStore();
  const { lt } = useLocalizedText();
  const openStampCount = officialStampGoals.filter((goal) => !completedStampGoalIds.includes(goal.id)).length;
  const promoActions = interestedPromotionIds.length + savedPromotionIds.length + bookedPromotionIds.length;
  const partnerReadyCount = partnerOffers.filter((offer) => offer.stage === "coupon" || offer.stage === "booking").length;
  const upcomingCalendarCount = calendarEvents.filter((event) => event.date >= new Date().toISOString().slice(0, 10)).length;

  const cards = [
    {
      id: "stamps",
      title: "Continue stamp missions",
      description: `${openStampCount} ${lt("useful actions left")}`,
      href: "/stamps",
      icon: BadgeCheck,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      id: "promos",
      title: "Pick a promo lane",
      description: `${promotionEvents.length} ${lt("curated picks")}`,
      href: "/promotions",
      icon: Gift,
      tone: "bg-violet-50 text-violet-700 ring-violet-100",
    },
    {
      id: "partners",
      title: "Review partner offers",
      description: `${partnerReadyCount} ${lt("ready-to-test lanes")}`,
      href: "/partners",
      icon: BadgePercent,
      tone: "bg-rose-50 text-rose-700 ring-rose-100",
    },
    {
      id: "my",
      title: "Review saved actions",
      description: promoActions > 0 ? `${promoActions} ${lt("promo actions saved")}` : `${upcomingCalendarCount} ${lt("calendar items")}`,
      href: "/my",
      icon: CalendarDays,
      tone: "bg-sky-50 text-sky-700 ring-sky-100",
    },
  ];

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700 ring-1 ring-gray-100">
              <Sparkles size={13} />
              {lt("Keep going")}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">{lt("Small loops that bring users back")}</p>
          </div>
          <Link href="/my" className="text-xs font-semibold text-sky-700">{lt("View My")}</Link>
        </div>
        <div className="mt-3 space-y-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} href={card.href} className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-3 transition-colors hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ring-1 ${card.tone}`}><Icon size={16} /></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{lt(card.title)}</p>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-gray-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
