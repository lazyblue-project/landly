"use client";

import Link from "next/link";
import { ArrowRight, Receipt, ShoppingBag } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function ShopQuickStart() {
  const { lt } = useLocalizedText();
  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Landly Shop")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Shop smarter, refund easier.")}</p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-emerald-600 shadow-sm">
            <ShoppingBag size={20} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/shop?tab=receipts" className="inline-flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-medium text-gray-800 shadow-sm">
            {lt("Receipt locker")}
            <Receipt size={16} className="text-emerald-600" />
          </Link>
          <Link href="/shop?tab=overview" className="inline-flex items-center justify-between rounded-2xl bg-emerald-600 px-3 py-3 text-sm font-medium text-white shadow-sm">
            {lt("Open Shop")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
