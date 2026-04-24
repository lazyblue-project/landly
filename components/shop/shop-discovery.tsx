"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { FilterChip } from "@/components/common/filter-chip";
import { EmptyState } from "@/components/common/empty-state";
import { ShopStoreCategory } from "@/types";
import { useShopStores } from "@/hooks/use-shop-stores";
import { ShopStoreCard } from "./shop-store-card";
import { ShopStoreDetailSheet } from "./shop-store-detail-sheet";
import { useLocalizedText } from "@/lib/text-localizer";

const categories: { value: ShopStoreCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "beauty", label: "Beauty" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "convenience", label: "Convenience" },
  { value: "department-store", label: "Department" },
  { value: "souvenir", label: "Souvenir" },
  { value: "duty-free", label: "Duty-free" },
];

export function ShopDiscovery() {
  const {
    stores,
    category,
    setCategory,
    refundType,
    setRefundType,
    onlyForeignCard,
    setOnlyForeignCard,
    onlyCoupon,
    setOnlyCoupon,
    search,
    setSearch,
  } = useShopStores();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedStore = stores.find((store) => store.id === selectedId) ?? null;
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={lt("Search beauty, pharmacy, gifts...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map(({ value, label }) => (
            <FilterChip key={value} label={lt(label)} active={category === value} onClick={() => setCategory(value)} />
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip label={lt("Immediate")} active={refundType === "immediate"} onClick={() => setRefundType(refundType === "immediate" ? "all" : "immediate")} />
          <FilterChip label={lt("General")} active={refundType === "general"} onClick={() => setRefundType(refundType === "general" ? "all" : "general")} />
          <FilterChip label={lt("Foreign card")} active={onlyForeignCard} onClick={() => setOnlyForeignCard(!onlyForeignCard)} />
          <FilterChip label={lt("Coupon")} active={onlyCoupon} onClick={() => setOnlyCoupon(!onlyCoupon)} />
        </div>
      </div>

      <div className="space-y-3">
        {stores.length === 0 ? (
          <EmptyState title={lt("No matching stores")} />
        ) : (
          stores.map((store) => <ShopStoreCard key={store.id} store={store} onSelect={() => setSelectedId(store.id)} />)
        )}
      </div>

      <ShopStoreDetailSheet store={selectedStore} open={Boolean(selectedStore)} onClose={() => setSelectedId(null)} />
    </div>
  );
}
