"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { ShopStore } from "@/types";
import { useAppStore } from "@/store/app-store";
import { getShopTrustBadges } from "@/lib/trust-badges";
import { useLocalizedText } from "@/lib/text-localizer";

interface ShopStoreCardProps {
  store: ShopStore;
  onSelect: () => void;
}

export function ShopStoreCard({ store, onSelect }: ShopStoreCardProps) {
  const { savedShopStoreIds, toggleSavedShopStore } = useAppStore();
  const saved = savedShopStoreIds.includes(store.id);
  const trustBadges = getShopTrustBadges(store);
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt(store.name)}</p>
          <p className="mt-1 text-xs text-gray-500">{lt(store.district)} · {lt(store.category)}</p>
        </div>
        <button type="button" onClick={() => toggleSavedShopStore(store.id)} className={`rounded-xl border px-2.5 py-2 text-xs ${saved ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
          {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary">{store.refundType === "both" ? lt("Immediate + general") : lt(store.refundType)}</Badge>
        {store.foreignCardSupported && <Badge variant="outline">{lt("Foreign card")}</Badge>}
        {store.couponAvailable && <Badge variant="outline">{lt("Coupon")}</Badge>}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">{lt(store.description)}</p>
      <TrustBadgeRow badges={trustBadges} compact />
      <SourceDisclosure metadata={store} compact className="mt-3" />

      <div className="mt-4 flex items-center gap-2">
        <button type="button" onClick={onSelect} className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white">
          {lt("View details")}
        </button>
        <a href={store.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700">
          {lt("Map")} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
