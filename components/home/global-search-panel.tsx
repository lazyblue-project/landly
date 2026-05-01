"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ExternalLink,
  FileText,
  HeartPulse,
  MapPin,
  MessageSquareText,
  Search,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { buildGlobalSearchResults, globalSearchCategoryLabels, searchGlobalResults, type GlobalSearchCategory } from "@/lib/global-search";
import { useUiCopy } from "@/lib/ui-copy";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const categoryIcons: Record<GlobalSearchCategory, LucideIcon> = {
  phrase: MessageSquareText,
  place: MapPin,
  care: HeartPulse,
  sos: ShieldAlert,
  shop: ShoppingBag,
  stay: FileText,
  official: Sparkles,
};

const categories: Array<GlobalSearchCategory | "all"> = ["all", "sos", "care", "phrase", "place", "shop", "stay", "official"];

function categoryTone(category: GlobalSearchCategory) {
  if (category === "sos") return "bg-red-50 text-red-700 ring-red-100";
  if (category === "care") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (category === "official") return "bg-blue-50 text-blue-700 ring-blue-100";
  return "bg-gray-50 text-gray-600 ring-gray-100";
}

export function GlobalSearchPanel() {
  const { t } = useUiCopy();
  const language = useAppStore((state) => state.user.language);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlobalSearchCategory | "all">("all");
  const allResults = useMemo(() => buildGlobalSearchResults(language), [language]);
  const results = useMemo(() => searchGlobalResults(allResults, query, category).slice(0, query.trim() ? 8 : 5), [allResults, category, query]);
  const showResults = query.trim().length > 0 || category !== "all";

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {t("global_search.eyebrow", undefined, "Quick find")}
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-950">
              {t("global_search.title", undefined, "Search phrases, care, places, and SOS")}
            </h2>
          </div>
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-700 ring-1 ring-blue-100">
            <Search size={18} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-blue-300 focus-within:bg-white">
          <Search size={17} className="shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("global_search.placeholder", undefined, "Try allergy, taxi, 119, refund, passport...")}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label={t("global_search.clear", undefined, "Clear search")}
            >
              <X size={15} />
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((item) => {
            const active = category === item;
            const label = item === "all" ? t("global_search.all", undefined, "All") : t(`global_search.category_${item}`, undefined, globalSearchCategoryLabels[item]);
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                  active ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-500 ring-1 ring-gray-100"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {showResults ? (
          <div className="mt-4 space-y-2">
            {results.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center text-xs font-medium text-gray-500">
                {t("global_search.empty", undefined, "No matching Landly items yet. Try a broader word.")}
              </div>
            ) : (
              results.map((result) => {
                const Icon = categoryIcons[result.category];
                const label = t(`global_search.category_${result.category}`, undefined, globalSearchCategoryLabels[result.category]);
                const content = (
                  <>
                    <div className={cn("rounded-2xl p-2 ring-1", categoryTone(result.category))}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-gray-950">{result.title}</p>
                        <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-500 ring-1 ring-gray-100">
                          {label}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{result.subtitle}</p>
                      <p className="mt-1 text-[11px] font-semibold text-gray-400">{result.meta}</p>
                    </div>
                    {result.external ? <ExternalLink size={14} className="shrink-0 text-gray-300" /> : null}
                  </>
                );

                if (result.external) {
                  return (
                    <a
                      key={result.id}
                      href={result.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 px-3 py-3 transition-colors hover:bg-gray-50"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 px-3 py-3 transition-colors hover:bg-gray-50"
                  >
                    {content}
                  </Link>
                );
              })
            )}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            {t(
              "global_search.help",
              undefined,
              "Use this when you do not remember which tab has a phrase, hospital, refund step, official source, or emergency flow."
            )}
          </p>
        )}
      </div>
    </section>
  );
}
