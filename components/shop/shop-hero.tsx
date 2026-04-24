"use client";

import Link from "next/link";
import { Receipt, ShoppingBag, Sparkles } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function ShopHero() {
  const { lt } = useLocalizedText();

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-emerald-100 text-sm">{lt("Landly Shop")}</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">{lt("Shop smarter, refund easier.")}</h2>
            <p className="mt-2 text-sm text-emerald-100 leading-relaxed max-w-xs">
              {lt("Find foreigner-friendly stores, keep receipts together, and stay ready for departure refund steps.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <ShoppingBag size={26} className="text-white" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-2xl bg-white/10 p-3">
            <Receipt size={16} className="mb-1" />
            {lt("Receipt locker")}
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Sparkles size={16} className="mb-1" />
            {lt("Beauty picks")}
          </div>
          <Link href="/shop/checker" className="rounded-2xl bg-white p-3 font-semibold text-teal-700">
            {lt("Check refund")}
          </Link>
        </div>
      </div>
    </section>
  );
}
