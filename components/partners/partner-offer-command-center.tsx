"use client";

import Link from "next/link";
import { ArrowRight, BadgePercent, Handshake, Sparkles } from "lucide-react";
import { partnerOffers } from "@/data/partner-offers";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import type { PartnerOfferCategory, PromotionAudience } from "@/types";

interface PartnerOfferCommandCenterProps {
  compact?: boolean;
  category?: PartnerOfferCategory;
}

function getPreferredAudience(visitPurpose: string): PromotionAudience {
  if (visitPurpose === "study") return "student";
  if (visitPurpose === "work" || visitPurpose === "residence") return "resident";
  return "first_timer";
}

export function PartnerOfferCommandCenter({ compact = false, category }: PartnerOfferCommandCenterProps) {
  const user = useAppStore((state) => state.user);
  const savedPartnerOfferIds = useAppStore((state) => state.savedPartnerOfferIds);
  const requestedPartnerOfferIds = useAppStore((state) => state.requestedPartnerOfferIds);
  const { lt } = useLocalizedText();
  const preferredAudience = getPreferredAudience(user.visitPurpose);
  const matchingOffers = partnerOffers
    .filter((offer) => !category || offer.category === category)
    .filter((offer) => offer.recommendedModes.includes(user.mode) || offer.audience.includes(preferredAudience))
    .sort((a, b) => a.priority - b.priority);
  const topOffer = matchingOffers[0] ?? partnerOffers[0];
  const commercialCount = partnerOffers.filter((offer) => offer.revenueModel !== "pilot").length;
  const savedCount = savedPartnerOfferIds.length + requestedPartnerOfferIds.length;
  const sectionClassName = compact ? "" : "px-4";
  const linkClassName = compact
    ? "mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700"
    : "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white";

  return (
    <section className={sectionClassName}>
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
              <Handshake size={13} />
              {lt("Partner growth layer")}
            </div>
            <p className="mt-3 text-base font-semibold text-gray-900">{lt("Turn high-intent moments into partner actions")}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("Landly can test coupons, bookings, referrals, and settlement leads while keeping commercial labels visible.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-violet-700 ring-1 ring-violet-100">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100">
            <p className="text-[11px] text-gray-500">{lt("Offers")}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{matchingOffers.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100">
            <p className="text-[11px] text-gray-500">{lt("Commercial")}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{commercialCount}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100">
            <p className="text-[11px] text-gray-500">{lt("Saved")}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{savedCount}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-gray-100">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-violet-50 p-2 text-violet-700">
              <BadgePercent size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{lt(topOffer.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(topOffer.subtitle)}</p>
            </div>
          </div>
        </div>

        <Link href="/partners" className={linkClassName}>
          {lt("Open partner offers")}
          <ArrowRight size={compact ? 13 : 16} />
        </Link>
      </div>
    </section>
  );
}
