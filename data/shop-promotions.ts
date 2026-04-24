import { ShopPromotion } from "@/types";

export const shopPromotions: ShopPromotion[] = [
  {
    id: "promo_001",
    title: "Korea Grand Sale shopping perks",
    category: "shopping-festival",
    sourceType: "official",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    ctaLink: "https://english.visitkorea.or.kr/",
    tags: ["official", "seasonal", "shopping"],
  },
  {
    id: "promo_002",
    title: "Olive Young tourist coupon page",
    category: "beauty",
    sourceType: "partner",
    ctaLink: "https://www.oliveyoung.com/",
    tags: ["beauty", "coupon", "tourist"],
  },
  {
    id: "promo_003",
    title: "Duty free welcome voucher",
    category: "duty-free",
    sourceType: "partner",
    ctaLink: "https://en.lottedfs.com/",
    tags: ["voucher", "duty-free"],
  },
];
