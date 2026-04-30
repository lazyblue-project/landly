"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, HeartPulse } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { ExploreFilters } from "@/components/explore/explore-filters";
import { PlaceList } from "@/components/explore/place-list";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { useUiCopy } from "@/lib/ui-copy";
import { useAppStore } from "@/store/app-store";
import { PlaceCategory } from "@/types";
import { useFilteredPlaces } from "@/hooks/use-filtered-places";
import { useLocalizedText } from "@/lib/text-localizer";

const allowedCategories = new Set<PlaceCategory | "all">([
  "all",
  "food",
  "cafe",
  "shopping",
  "hospital",
  "pharmacy",
  "convenience",
  "exchange",
  "sightseeing",
  "transport",
]);

export default function ExplorePage() {
  return (
    <Suspense>
      <ExplorePageContent />
    </Suspense>
  );
}

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useUiCopy();
  const { lt } = useLocalizedText();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const initialCategory = (searchParams.get("category") ?? "all") as PlaceCategory | "all";
  const safeCategory = allowedCategories.has(initialCategory) ? initialCategory : "all";
  const { places, category, setCategory, filter, toggleFilter, toggleLanguage, search, setSearch } =
    useFilteredPlaces(safeCategory === "all" ? undefined : safeCategory);

  if (!hasHydrated) return <PageSkeleton />;

  const handleCategoryChange = (nextCategory: PlaceCategory | "all") => {
    setCategory(nextCategory);
    const params = new URLSearchParams(searchParams.toString());

    if (nextCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <AppShell>
      <TopBar title={t("explore.title", undefined, "Explore")} />

      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("explore.search_placeholder", undefined, "Search places...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {(category === "all" || category === "shopping") && (
        <div className="px-4 pt-3">
          <Link href="/shop?tab=stores" className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="rounded-2xl bg-white p-2 text-emerald-600 shadow-sm">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{lt("Need tax refund-friendly stores?")}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {lt("Open Landly Shop for beauty, pharmacy, and souvenir spots with refund-focused guidance.")}
              </p>
            </div>
          </Link>
        </div>
      )}

      {(category === "all" || category === "hospital" || category === "pharmacy") && (
        <div className="px-4 pt-3">
          <Link href="/care?tab=providers" className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <div className="rounded-2xl bg-white p-2 text-rose-600 shadow-sm">
              <HeartPulse size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{lt("Need care guidance instead of just a place list?")}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {lt("Open Landly Care for symptom triage, official support lines, and foreigner-friendly clinic guidance.")}
              </p>
            </div>
          </Link>
        </div>
      )}

      <ExploreFilters
        category={category}
        onCategoryChange={handleCategoryChange}
        activeFilters={filter}
        onFilterToggle={toggleFilter}
        onLanguageToggle={toggleLanguage}
      />

      <PlaceList places={places} />
    </AppShell>
  );
}
