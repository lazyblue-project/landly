"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgePercent, Filter, Handshake } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { PartnerOfferCard } from "@/components/partners/partner-offer-card";
import { PartnerOfferCommandCenter } from "@/components/partners/partner-offer-command-center";
import { PartnerMonetizationDisclosure } from "@/components/partners/partner-monetization-disclosure";
import { PartnerCommercialPolicyPanel } from "@/components/partners/partner-commercial-policy-panel";
import { partnerOffers } from "@/data/partner-offers";
import type { PartnerOfferCategory, PromotionAudience } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { isCommercialPartnerOffer } from "@/lib/partner-disclosure";

const categoryFilters: Array<"all" | PartnerOfferCategory> = ["all", "shopping", "transport", "care", "stay", "experience"];
const audienceFilters: Array<"all" | PromotionAudience> = ["all", "first_timer", "shopper", "student", "resident", "wellness"];

function isCategoryFilter(value: string | null): value is "all" | PartnerOfferCategory {
  return value !== null && categoryFilters.includes(value as PartnerOfferCategory);
}

function isAudienceFilter(value: string | null): value is "all" | PromotionAudience {
  return value !== null && audienceFilters.includes(value as PromotionAudience);
}

function applyPartnerQueryFilters(
  setCategory: (value: "all" | PartnerOfferCategory) => void,
  setAudience: (value: "all" | PromotionAudience) => void
) {
  const query = new URLSearchParams(window.location.search);
  const categoryParam = query.get("category");
  const audienceParam = query.get("audience");

  if (isCategoryFilter(categoryParam)) setCategory(categoryParam);
  if (isAudienceFilter(audienceParam)) setAudience(audienceParam);
}

export default function PartnersPage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const userMode = useAppStore((state) => state.user.mode);
  const savedPartnerOfferIds = useAppStore((state) => state.savedPartnerOfferIds);
  const requestedPartnerOfferIds = useAppStore((state) => state.requestedPartnerOfferIds);
  const acknowledgedPartnerDisclosureIds = useAppStore((state) => state.acknowledgedPartnerDisclosureIds);
  const toggleSavedPartnerOffer = useAppStore((state) => state.toggleSavedPartnerOffer);
  const toggleRequestedPartnerOffer = useAppStore((state) => state.toggleRequestedPartnerOffer);
  const acknowledgePartnerDisclosure = useAppStore((state) => state.acknowledgePartnerDisclosure);
  const { lt } = useLocalizedText();
  const [category, setCategory] = useState<"all" | PartnerOfferCategory>("all");
  const [audience, setAudience] = useState<"all" | PromotionAudience>("all");

  useEffect(() => {
    applyPartnerQueryFilters(setCategory, setAudience);
  }, []);

  const visibleOffers = useMemo(() => partnerOffers
    .filter((offer) => category === "all" || offer.category === category)
    .filter((offer) => audience === "all" || offer.audience.includes(audience))
    .sort((a, b) => {
      const aMode = a.recommendedModes.includes(userMode) ? 0 : 1;
      const bMode = b.recommendedModes.includes(userMode) ? 0 : 1;
      return aMode - bMode || a.priority - b.priority;
    }), [audience, category, userMode]);

  const commercialCount = partnerOffers.filter(isCommercialPartnerOffer).length;
  const acknowledgedCount = partnerOffers.filter((offer) => acknowledgedPartnerDisclosureIds.includes(offer.id)).length;
  const readyToTestCount = partnerOffers.filter((offer) => offer.stage === "coupon" || offer.stage === "booking").length;

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Partner offers")} showBack />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Partner offers")} showBack />
      <div className="space-y-4 px-4 py-4">
        <section className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 shadow-sm ring-1 ring-violet-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
                <Handshake size={13} /> {lt("Partner growth layer")}
              </div>
              <p className="mt-3 text-lg font-semibold text-gray-900">{lt("Monetization-ready flows, still user-first")}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {lt("Use this page to test which Landly moments can become coupons, bookings, referrals, or settlement leads while keeping source, confirmation, and commercial labels visible.")}
              </p>
            </div>
            <BadgePercent className="mt-1 text-violet-500" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Offers")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{partnerOffers.length}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Commercial")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{commercialCount}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Disclosed")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{acknowledgedCount}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] text-gray-500">{lt("Ready")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{readyToTestCount}</p></div>
          </div>
        </section>

        <PartnerOfferCommandCenter compact />
        <PartnerMonetizationDisclosure />
        <PartnerCommercialPolicyPanel />

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Filter size={16} /> {lt("Filter partner lanes")}</div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categoryFilters.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${category === item ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>{lt(item === "all" ? "All" : item)}</button>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {audienceFilters.map((item) => (
              <button key={item} type="button" onClick={() => setAudience(item)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${audience === item ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-600"}`}>{lt(item === "all" ? "All users" : item)}</button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          {visibleOffers.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-5 text-sm leading-relaxed text-gray-500 shadow-sm">
              {lt("No partner lanes match this filter yet. Try another audience or category.")}
            </div>
          ) : null}
          {visibleOffers.map((offer) => (
            <PartnerOfferCard
              key={offer.id}
              offer={offer}
              saved={savedPartnerOfferIds.includes(offer.id)}
              requested={requestedPartnerOfferIds.includes(offer.id)}
              disclosureAcknowledged={acknowledgedPartnerDisclosureIds.includes(offer.id)}
              onToggleSave={() => toggleSavedPartnerOffer(offer.id)}
              onToggleRequest={() => toggleRequestedPartnerOffer(offer.id)}
              onAcknowledgeDisclosure={() => acknowledgePartnerDisclosure(offer.id)}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
