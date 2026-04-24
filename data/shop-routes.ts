import { ShoppingRoute } from "@/types";

export const shoppingRoutes: ShoppingRoute[] = [
  {
    id: "route_001",
    title: "Beginner K-beauty route",
    summary: "Easy first-time beauty route with immediate refund-friendly stops.",
    districts: ["Myeong-dong"],
    tags: ["beauty", "easy", "refund"],
    stopStoreIds: ["shop_001", "shop_006", "shop_007"],
  },
  {
    id: "route_002",
    title: "Trend shopping route",
    summary: "Pair trendy cafes and shopping in Seongsu with a beauty stop.",
    districts: ["Seongsu", "Hongdae"],
    tags: ["trend", "beauty", "shopping"],
    stopStoreIds: ["shop_008", "shop_002"],
  },
];
