"use client";

import { BookmarkPlus, ExternalLink, MapPin, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { shoppingRoutes } from "@/data/shop-routes";
import { shopStores } from "@/data/shop-stores";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import type { ShopStore } from "@/types";

export function ShoppingRoutePlanner() {
  const { savedShopStoreIds, toggleSavedShopStore, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();

  const handleSaveRoute = (storeIds: string[]) => {
    storeIds.forEach((storeId) => {
      if (!savedShopStoreIds.includes(storeId)) {
        toggleSavedShopStore(storeId);
      }
    });
    showSnackbar(lt("Route stores saved."), "success");
  };

  return (
    <section className="px-4 pt-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Shopping routes")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Pick a ready-made route, save the stops, and keep refund tips visible before checkout.")}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
          <Route size={18} />
        </div>
      </div>

      <div className="space-y-3">
        {shoppingRoutes.map((route) => {
          const stops = route.stopStoreIds
            .map((storeId) => shopStores.find((store) => store.id === storeId))
            .filter((store): store is ShopStore => Boolean(store));
          const firstStop = stops[0];

          return (
            <article key={route.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lt(route.title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(route.summary)}</p>
                </div>
                {route.durationLabel ? (
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    {lt(route.durationLabel)}
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {route.districts.map((district) => (
                  <Badge key={district} variant="outline">{lt(district)}</Badge>
                ))}
                {route.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{lt(tag)}</Badge>
                ))}
              </div>

              {route.bestFor ? <p className="mt-3 text-xs leading-relaxed text-gray-600">{lt(route.bestFor)}</p> : null}

              <div className="mt-3 space-y-2">
                {stops.map((store, index) => (
                  <div key={store.id} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-gray-500">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{lt(store.name)}</span>
                    <span className="text-gray-400">{lt(store.refundType === "both" ? "both" : store.refundType)}</span>
                  </div>
                ))}
              </div>

              {route.refundTip ? (
                <div className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  {lt(route.refundTip)}
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveRoute(route.stopStoreIds)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white"
                >
                  <BookmarkPlus size={14} />
                  {lt("Save route stops")}
                </button>
                {firstStop ? (
                  <a href={firstStop.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700">
                    <MapPin size={14} />
                    {lt("Open first stop")}
                    <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
