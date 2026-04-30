"use client";

import Link from "next/link";
import { ArrowRight, BookmarkCheck, CalendarPlus2, ExternalLink, Send } from "lucide-react";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { PartnerCommercialDisclosureCard } from "@/components/partners/partner-commercial-disclosure-card";
import type { PartnerOffer } from "@/types";
import { getPartnerOfferTrustBadges } from "@/lib/trust-badges";
import { useLocalizedText } from "@/lib/text-localizer";

const categoryTone: Record<PartnerOffer["category"], string> = {
  shopping: "bg-rose-50 text-rose-700 ring-rose-100",
  care: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  stay: "bg-sky-50 text-sky-700 ring-sky-100",
  experience: "bg-amber-50 text-amber-700 ring-amber-100",
  transport: "bg-violet-50 text-violet-700 ring-violet-100",
};

interface PartnerOfferCardProps {
  offer: PartnerOffer;
  saved: boolean;
  requested: boolean;
  disclosureAcknowledged: boolean;
  onToggleSave: () => void;
  onToggleRequest: () => void;
  onAcknowledgeDisclosure: () => void;
  compact?: boolean;
}

export function PartnerOfferCard({
  offer,
  saved,
  requested,
  disclosureAcknowledged,
  onToggleSave,
  onToggleRequest,
  onAcknowledgeDisclosure,
  compact = false,
}: PartnerOfferCardProps) {
  const { lt } = useLocalizedText();
  const trustBadges = getPartnerOfferTrustBadges(offer);
  const canSendInterest = disclosureAcknowledged || requested;

  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${categoryTone[offer.category]}`}>{lt(offer.category)}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">{lt(offer.revenueModel)}</span>
            {offer.validUntil ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{lt("Until")} {offer.validUntil}</span> : null}
          </div>
          <p className="mt-3 text-base font-semibold text-gray-900">{lt(offer.title)}</p>
          <p className="mt-1 text-sm font-medium text-gray-600">{lt(offer.subtitle)}</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{lt(offer.description)}</p>
        </div>
      </div>

      <TrustBadgeRow badges={trustBadges} />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] text-gray-500">{lt("Partner")}</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{lt(offer.partnerName)}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[11px] text-gray-500">{lt("Value")}</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{lt(offer.estimatedValueLabel)}</p>
        </div>
      </div>

      {!compact ? (
        <>
          <div className="mt-3 rounded-2xl bg-violet-50 p-3 text-xs leading-relaxed text-violet-800">
            <p className="font-semibold">{lt("Why this can convert")}</p>
            <p className="mt-1">{lt(offer.benefit)}</p>
          </div>
          <div className="mt-3 rounded-2xl bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-900">{lt("Before the user taps")}</p>
            <ul className="mt-2 space-y-1">
              {offer.checklist.map((item) => (
                <li key={item} className="text-xs leading-relaxed text-gray-600">• {lt(item)}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <PartnerCommercialDisclosureCard
              offer={offer}
              acknowledged={disclosureAcknowledged}
              onAcknowledge={onAcknowledgeDisclosure}
            />
          </div>
        </>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {offer.audience.map((audience) => <span key={audience} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">{lt(audience)}</span>)}
        {offer.tags.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">#{lt(tag)}</span>)}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Link href={offer.href} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white">
          {lt(offer.ctaLabel)} <ArrowRight size={16} />
        </Link>
        <button type="button" onClick={onToggleSave} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${saved ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-700"}`}>
          <BookmarkCheck size={16} /> {lt(saved ? "Saved offer" : "Save offer")}
        </button>
        <button
          type="button"
          onClick={canSendInterest ? onToggleRequest : onAcknowledgeDisclosure}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${requested ? "bg-violet-600 text-white" : canSendInterest ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-800"}`}
        >
          <Send size={16} /> {lt(requested ? "Interest sent" : canSendInterest ? "Send interest" : "Review disclosure first")}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
        <span>{lt("City:")} {lt(offer.city)}</span>
        {offer.href.startsWith("http") ? <ExternalLink size={13} /> : <CalendarPlus2 size={13} />}
      </div>
    </article>
  );
}
