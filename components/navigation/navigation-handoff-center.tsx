"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  HeartPulse,
  Map,
  MapPin,
  Navigation,
  PlaneLanding,
  Route,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { navigationHandoffs } from "@/data/navigation-handoff";
import { careProviders } from "@/data/care-providers";
import { places } from "@/data/places";
import { shopStores } from "@/data/shop-stores";
import { buildGoogleMapsDirectionsUrl, buildNaverMapUrl } from "@/lib/pass-utils";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";
import { NavigationHandoff } from "@/types";

const categoryMeta: Record<NavigationHandoff["category"], { icon: typeof MapPin; tone: string; label: string }> = {
  arrival: { icon: PlaneLanding, tone: "bg-sky-50 text-sky-700 ring-sky-100", label: "Arrival" },
  place: { icon: MapPin, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", label: "Saved place" },
  shopping: { icon: ShoppingBag, tone: "bg-rose-50 text-rose-700 ring-rose-100", label: "Shopping" },
  care: { icon: HeartPulse, tone: "bg-red-50 text-red-700 ring-red-100", label: "Care" },
  stay: { icon: ShieldCheck, tone: "bg-violet-50 text-violet-700 ring-violet-100", label: "Stay" },
  emergency: { icon: ShieldCheck, tone: "bg-amber-50 text-amber-700 ring-amber-100", label: "Emergency" },
};

function openExternal(url: string) {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function getSavedDestination(args: {
  handoff: NavigationHandoff;
  savedPlaceName?: string;
  savedShopName?: string;
  savedCareName?: string;
}) {
  if (args.handoff.category === "place" && args.savedPlaceName) return args.savedPlaceName;
  if (args.handoff.category === "shopping" && args.savedShopName) return args.savedShopName;
  if (args.handoff.category === "care" && args.savedCareName) return args.savedCareName;
  return args.handoff.destinationLabel;
}

interface NavigationHandoffCenterProps {
  compact?: boolean;
  className?: string;
}

export function NavigationHandoffCenter({ compact = false, className }: NavigationHandoffCenterProps) {
  const {
    user,
    savedPassPlans,
    savedShopStoreIds,
    savedCareProviderIds,
    showSnackbar,
  } = useAppStore();
  const { lt } = useLocalizedText();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const savedPlace = useMemo(
    () => places.find((place) => user.savedPlaceIds.includes(place.id)),
    [user.savedPlaceIds]
  );
  const savedShop = useMemo(
    () => shopStores.find((store) => savedShopStoreIds.includes(store.id)) ?? shopStores[0],
    [savedShopStoreIds]
  );
  const savedCare = useMemo(
    () => careProviders.find((provider) => savedCareProviderIds.includes(provider.id)) ?? careProviders[0],
    [savedCareProviderIds]
  );

  const firstPassPlan = savedPassPlans[0];
  const routeScore = [savedPlace, firstPassPlan, savedShopStoreIds.length > 0, savedCareProviderIds.length > 0].filter(Boolean).length;

  const rankedHandoffs = useMemo(() => {
    return navigationHandoffs
      .filter((item) => item.recommendedModes.includes(user.mode))
      .map((item) => {
        let score = item.priority;
        if (user.firstNeed === "airport_transport" && item.category === "arrival") score += 24;
        if (user.firstNeed === "shopping_refund" && item.category === "shopping") score += 24;
        if (user.firstNeed === "hospital_pharmacy" && item.category === "care") score += 24;
        if (user.firstNeed === "long_stay_setup" && item.category === "stay") score += 24;
        if (user.savedPlaceIds.length > 0 && item.category === "place") score += 18;
        if (savedShopStoreIds.length > 0 && item.category === "shopping") score += 10;
        if (savedCareProviderIds.length > 0 && item.category === "care") score += 10;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [savedCareProviderIds.length, savedShopStoreIds.length, user.firstNeed, user.mode, user.savedPlaceIds.length]);

  const visibleHandoffs = compact ? rankedHandoffs.slice(0, 2) : rankedHandoffs;

  const copyPhrase = async (item: NavigationHandoff, destination: string) => {
    const text = `${lt(item.phraseHint)}\n${lt("Destination")}: ${destination}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      showSnackbar(lt("Navigation phrase copied."), "success");
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      showSnackbar(lt("Copy failed. Please try again."), "warning");
    }
  };

  return (
    <section className={cn(compact ? "px-4 pt-4" : "space-y-4", className)}>
      <div className={cn("rounded-3xl border border-blue-100 bg-white p-4 shadow-sm", compact ? "" : "")}> 
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-600 p-2 text-white shadow-sm">
            <Route size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-500">{lt("Map handoff")}</p>
            <h2 className="mt-1 text-base font-black text-gray-950">{lt("Open the right route faster")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {lt("Landly prepares Google Maps, NAVER Map, Korean phrases, and backup checks before you move.")}
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-3 py-2 text-right ring-1 ring-blue-100">
            <p className="text-[10px] font-bold text-blue-500">{lt("Ready")}</p>
            <p className="text-sm font-black text-blue-700">{routeScore}/4</p>
          </div>
        </div>

        {!compact ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Google Maps", "NAVER Map", "Korean phrase"].map((label) => (
              <div key={label} className="rounded-2xl bg-gray-50 p-3 text-center ring-1 ring-gray-100">
                <p className="text-xs font-bold text-gray-900">{lt(label)}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className={cn("space-y-3", compact ? "mt-3" : "")}> 
        {visibleHandoffs.map((item) => {
          const meta = categoryMeta[item.category];
          const Icon = meta.icon;
          const origin = item.category === "arrival" && firstPassPlan ? firstPassPlan.input.airport : item.originLabel;
          const destination = item.category === "arrival" && firstPassPlan
            ? firstPassPlan.input.destinationArea
            : getSavedDestination({
                handoff: item,
                savedPlaceName: savedPlace?.name,
                savedShopName: savedShop?.name,
                savedCareName: savedCare?.name,
              });
          const googleUrl = buildGoogleMapsDirectionsUrl({ origin, destination, transportType: item.transportType });
          const naverUrl = buildNaverMapUrl({ origin, destination, transportType: item.transportType });

          return (
            <article key={item.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={cn("rounded-2xl p-2 ring-1", meta.tone)}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-gray-950">{lt(item.title)}</p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {lt(meta.label)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(item.description)}</p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-100">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{lt(origin)} → {lt(destination)}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{lt("Confirm live hours, fares, and exact pickup points before moving.")}</p>
                  </div>
                </div>
              </div>

              {!compact ? (
                <ul className="mt-3 space-y-2">
                  {item.checklist.map((step) => (
                    <li key={step} className="flex gap-2 text-xs leading-relaxed text-gray-600">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span>{lt(step)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => openExternal(googleUrl)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-gray-950 px-3 py-2 text-xs font-bold text-white">
                  <Map size={14} /> {lt("Google")}
                </button>
                <button type="button" onClick={() => openExternal(naverUrl)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">
                  <Navigation size={14} /> {lt("NAVER")}
                </button>
                <button type="button" onClick={() => copyPhrase(item, lt(destination))} className="flex items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">
                  <Copy size={14} /> {copiedId === item.id ? lt("Copied!") : lt("Copy phrase")}
                </button>
                <Link href={item.href} className="flex items-center justify-center gap-1.5 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                  {lt("Open flow")} <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {compact ? (
        <Link href="/navigate" className="mt-3 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          <span>{lt("Open map handoff center")}</span>
          <ExternalLink size={15} />
        </Link>
      ) : null}
    </section>
  );
}
