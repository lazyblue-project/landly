import { ShoppingRoute } from "@/types";

export const shoppingRoutes: ShoppingRoute[] = [
  {
    id: "route_001",
    title: "Beginner K-beauty route",
    summary: "Easy first-time beauty route with immediate refund-friendly stops.",
    districts: ["Myeong-dong"],
    tags: ["beauty", "easy", "refund"],
    stopStoreIds: ["shop_001", "shop_006", "shop_007"],
    durationLabel: "2–3 hours",
    bestFor: "First-time shoppers who want beauty, snacks, and pharmacy essentials in one area.",
    refundTip: "Start with immediate-refund stores, then save any general-refund receipts before you leave Myeong-dong.",
  },
  {
    id: "route_002",
    title: "Trend shopping route",
    summary: "Pair trendy cafes and shopping in Seongsu with a beauty stop.",
    districts: ["Seongsu", "Hongdae"],
    tags: ["trend", "beauty", "shopping"],
    stopStoreIds: ["shop_008", "shop_002"],
    durationLabel: "Half day",
    bestFor: "Travelers who want popup streets, cafes, and trend-focused beauty products.",
    refundTip: "Ask each store whether refund is immediate or airport-based before opening the products.",
  },
  {
    id: "route_003",
    title: "Duty-free and premium route",
    summary: "A compact premium shopping path for vouchers, duty-free, and department store purchases.",
    districts: ["Sogong-dong", "Gangnam"],
    tags: ["duty-free", "premium", "voucher"],
    stopStoreIds: ["shop_003", "shop_004"],
    durationLabel: "Half day",
    bestFor: "Visitors buying higher-value gifts, beauty sets, or luxury items.",
    refundTip: "Keep passport details ready at checkout and separate duty-free vouchers from general tax refund receipts.",
  },
];
