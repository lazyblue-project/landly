"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShopStore } from "@/types";
import { useAppStore } from "@/store/app-store";
import { ExternalLink, Receipt, X } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

interface ShopStoreDetailSheetProps {
  store: ShopStore | null;
  open: boolean;
  onClose: () => void;
}

export function ShopStoreDetailSheet({ store, open, onClose }: ShopStoreDetailSheetProps) {
  const { toggleSavedShopStore, savedShopStoreIds } = useAppStore();
  const { lt } = useLocalizedText();

  if (!open || !store) return null;

  const saved = savedShopStoreIds.includes(store.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4">
      <div className="mx-auto mt-12 max-w-md rounded-3xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-600">{lt("Landly Shop")}</p>
            <h3 className="mt-1 text-lg font-bold text-gray-900">{lt(store.name)}</h3>
            <p className="mt-1 text-sm text-gray-500">{lt(store.district)} · {lt(store.category)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-gray-100 p-2 text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{store.refundType === "both" ? lt("Immediate + general") : lt(store.refundType)}</Badge>
          {store.foreignCardSupported && <Badge variant="outline">{lt("Foreign card OK")}</Badge>}
          {store.passportNeededAtCheckout && <Badge variant="outline">{lt("Passport at checkout")}</Badge>}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-700">{lt(store.description)}</p>

        <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">{lt("Before you pay")}</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• {lt("Ask if tax refund is immediate or handled later.")}</li>
            <li>• {lt("Keep your passport ready if the cashier requests it.")}</li>
            <li>• {lt("Save the receipt after checkout if refund is still pending.")}</li>
          </ul>
        </div>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={() => toggleSavedShopStore(store.id)}
            className={`rounded-xl px-3 py-3 text-sm font-medium ${saved ? "bg-emerald-50 text-emerald-700" : "bg-gray-900 text-white"}`}
          >
            {saved ? lt("Saved store") : lt("Save this store")}
          </button>
          <Link href="/shop/receipts" className="inline-flex items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700">
            {lt("Add receipt later")}
            <Receipt size={16} />
          </Link>
          <Link href="/assistant?category=shopping" className="inline-flex items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700">
            {lt("Show shopping phrases")}
          </Link>
          <Link href={store.officialLink ?? store.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700">
            {lt("Official link")}
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
