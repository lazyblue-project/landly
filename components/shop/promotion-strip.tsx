"use client";

import { shopPromotions } from "@/data/shop-promotions";
import { useLocalizedText } from "@/lib/text-localizer";

export function PromotionStrip() {
  const { lt } = useLocalizedText();

  return (
    <section className="px-4 pt-4">
      <div className="space-y-3">
        {shopPromotions.map((promotion) => (
          <a key={promotion.id} href={promotion.ctaLink} target="_blank" rel="noreferrer" className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-emerald-600">{lt(promotion.category)}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{lt(promotion.title)}</p>
            <p className="mt-2 text-xs text-gray-500">{promotion.tags.map((tag) => lt(tag)).join(" · ")}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
