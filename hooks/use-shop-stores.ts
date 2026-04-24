import { useMemo, useState } from "react";
import { Language, ShopRefundType, ShopStore, ShopStoreCategory } from "@/types";
import { shopStores } from "@/data/shop-stores";

export function useShopStores(initialCategory: ShopStoreCategory | "all" = "all") {
  const [category, setCategory] = useState<ShopStoreCategory | "all">(initialCategory);
  const [refundType, setRefundType] = useState<ShopRefundType | "all">("all");
  const [language, setLanguage] = useState<Language | "all">("all");
  const [onlyForeignCard, setOnlyForeignCard] = useState(false);
  const [onlyCoupon, setOnlyCoupon] = useState(false);
  const [search, setSearch] = useState("");

  const stores = useMemo(() => {
    return shopStores.filter((store: ShopStore) => {
      if (category !== "all" && store.category !== category) return false;
      if (refundType !== "all" && store.refundType !== refundType && !(refundType === "general" && store.refundType === "both") && !(refundType === "immediate" && store.refundType === "both")) return false;
      if (language !== "all" && !store.supportedLanguages.includes(language)) return false;
      if (onlyForeignCard && !store.foreignCardSupported) return false;
      if (onlyCoupon && !store.couponAvailable) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !store.name.toLowerCase().includes(q) &&
          !store.description.toLowerCase().includes(q) &&
          !store.tags.some((tag) => tag.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [category, refundType, language, onlyForeignCard, onlyCoupon, search]);

  return {
    stores,
    category,
    setCategory,
    refundType,
    setRefundType,
    language,
    setLanguage,
    onlyForeignCard,
    setOnlyForeignCard,
    onlyCoupon,
    setOnlyCoupon,
    search,
    setSearch,
  };
}
