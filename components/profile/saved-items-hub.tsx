"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  ExternalLink,
  FileText,
  HeartPulse,
  MapPin,
  MessageSquareText,
  Receipt,
  ShoppingBag,
  Tickets,
} from "lucide-react";
import { careProviders } from "@/data/care-providers";
import { phrases } from "@/data/phrases";
import { places } from "@/data/places";
import { promotionEvents } from "@/data/promo-events";
import { shopStores } from "@/data/shop-stores";
import { stayResources } from "@/data/stay-resources";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

type HubTab = "places" | "phrases" | "shops" | "care" | "receipts" | "documents" | "calendar" | "promotions";

interface HubTabMeta {
  id: HubTab;
  label: string;
  count: number;
  icon: ReactNode;
}

interface HubRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  tag?: string;
  href?: string;
  externalHref?: string;
}

function HubRow({ icon, title, subtitle, tag, href, externalHref }: HubRowProps) {
  const { lt } = useLocalizedText();
  const content = (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:bg-gray-50">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">{icon}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{lt(title)}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{lt(subtitle)}</p>
          {tag ? <span className="mt-2 inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">{lt(tag)}</span> : null}
        </div>
      </div>
      {externalHref ? <ExternalLink size={15} className="mt-1 shrink-0 text-gray-400" /> : <ArrowRight size={15} className="mt-1 shrink-0 text-gray-400" />}
    </div>
  );

  if (externalHref) {
    return (
      <a href={externalHref} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function EmptyHubState({ label }: { label: string }) {
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
      <Bookmark className="mx-auto text-gray-300" size={28} />
      <p className="mt-2 text-sm font-medium text-gray-700">{lt("Nothing saved here yet")}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Use Landly features and tap Save to build your personal Korea toolkit.")}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{lt(label)}</p>
    </div>
  );
}

export function SavedItemsHub() {
  const {
    user,
    savedShopStoreIds,
    savedCareProviderIds,
    savedStayResourceIds,
    receiptRecords,
    stayDocuments,
    calendarEvents,
    savedPromotionIds,
    interestedPromotionIds,
    bookedPromotionIds,
  } = useAppStore();
  const { lt } = useLocalizedText();
  const [activeTab, setActiveTab] = useState<HubTab>("places");

  const savedPlaces = useMemo(() => places.filter((place) => user.savedPlaceIds.includes(place.id)), [user.savedPlaceIds]);
  const savedPhrases = useMemo(() => phrases.filter((phrase) => user.savedPhraseIds.includes(phrase.id)), [user.savedPhraseIds]);
  const savedShops = useMemo(() => shopStores.filter((store) => savedShopStoreIds.includes(store.id)), [savedShopStoreIds]);
  const savedCareProviders = useMemo(() => careProviders.filter((provider) => savedCareProviderIds.includes(provider.id)), [savedCareProviderIds]);
  const savedStayResources = useMemo(() => stayResources.filter((resource) => savedStayResourceIds.includes(resource.id)), [savedStayResourceIds]);
  const savedPromotions = useMemo(
    () =>
      promotionEvents.filter(
        (event) =>
          savedPromotionIds.includes(event.id) ||
          interestedPromotionIds.includes(event.id) ||
          bookedPromotionIds.includes(event.id)
      ),
    [bookedPromotionIds, interestedPromotionIds, savedPromotionIds]
  );

  const tabs: HubTabMeta[] = [
    { id: "places", label: "Places", count: savedPlaces.length, icon: <MapPin size={14} /> },
    { id: "phrases", label: "Phrases", count: savedPhrases.length, icon: <MessageSquareText size={14} /> },
    { id: "shops", label: "Shops", count: savedShops.length, icon: <ShoppingBag size={14} /> },
    { id: "care", label: "Care", count: savedCareProviders.length, icon: <HeartPulse size={14} /> },
    { id: "receipts", label: "Receipts", count: receiptRecords.length, icon: <Receipt size={14} /> },
    { id: "documents", label: "Documents", count: stayDocuments.length + savedStayResources.length, icon: <FileText size={14} /> },
    { id: "calendar", label: "Calendar", count: calendarEvents.length, icon: <CalendarDays size={14} /> },
    { id: "promotions", label: "Promos", count: savedPromotions.length, icon: <Tickets size={14} /> },
  ];

  const renderActiveList = () => {
    if (activeTab === "places") {
      return savedPlaces.length === 0 ? <EmptyHubState label="Places" /> : savedPlaces.map((place) => (
        <HubRow key={place.id} icon={<MapPin size={16} />} title={place.name} subtitle={`${place.city} · ${place.category} · ${place.address}`} tag={place.needsConfirmation ? "Needs confirmation" : "Saved"} href="/explore" />
      ));
    }

    if (activeTab === "phrases") {
      return savedPhrases.length === 0 ? <EmptyHubState label="Phrases" /> : savedPhrases.map((phrase) => (
        <HubRow key={phrase.id} icon={<MessageSquareText size={16} />} title={phrase.english} subtitle={phrase.korean} tag={phrase.category} href="/assistant" />
      ));
    }

    if (activeTab === "shops") {
      return savedShops.length === 0 ? <EmptyHubState label="Shops" /> : savedShops.map((store) => (
        <HubRow key={store.id} icon={<ShoppingBag size={16} />} title={store.name} subtitle={`${store.district} · ${store.category} · ${store.refundType} refund`} tag={store.couponAvailable ? "Coupon available" : "Saved shop"} href="/shop?tab=stores" />
      ));
    }

    if (activeTab === "care") {
      return savedCareProviders.length === 0 ? <EmptyHubState label="Care" /> : savedCareProviders.map((provider) => (
        <HubRow key={provider.id} icon={<HeartPulse size={16} />} title={provider.name} subtitle={`${provider.district} · ${provider.category} · ${provider.supportedLanguages.join(", ")}`} tag={provider.nightHours ? "Night hours" : "Saved provider"} href="/care?tab=providers" />
      ));
    }

    if (activeTab === "receipts") {
      return receiptRecords.length === 0 ? <EmptyHubState label="Receipts" /> : receiptRecords.map((receipt) => {
        const storeName = receipt.storeName ?? shopStores.find((store) => store.id === receipt.storeId)?.name ?? "Tax refund receipt";
        const amount = `KRW ${receipt.amount.toLocaleString()}`;
        const estimatedRefund = receipt.estimatedRefundAmount ? ` · est. KRW ${receipt.estimatedRefundAmount.toLocaleString()}` : "";
        return <HubRow key={receipt.id} icon={<Receipt size={16} />} title={storeName} subtitle={`${amount}${estimatedRefund} · ${receipt.purchaseDate}`} tag={receipt.refundStatus} href="/shop/receipts" />;
      });
    }

    if (activeTab === "documents") {
      const documentRows = stayDocuments.map((document) => (
        <HubRow key={document.id} icon={<FileText size={16} />} title={document.title} subtitle={`${document.category} · ${document.expiryDate ? `expires ${document.expiryDate}` : "note only"}`} tag={document.tags[0] ?? "Document"} href="/stay?tab=documents" />
      ));
      const resourceRows = savedStayResources.map((resource) => (
        <HubRow key={resource.id} icon={<Bookmark size={16} />} title={resource.title} subtitle={`${resource.provider} · ${resource.type}`} tag={resource.trustLevel ?? "Saved resource"} externalHref={resource.link} />
      ));
      return documentRows.length + resourceRows.length === 0 ? <EmptyHubState label="Documents" /> : [...documentRows, ...resourceRows];
    }

    if (activeTab === "calendar") {
      return calendarEvents.length === 0 ? <EmptyHubState label="Calendar" /> : calendarEvents.map((event) => (
        <HubRow key={event.id} icon={<CalendarDays size={16} />} title={event.title} subtitle={`${event.date}${event.location ? ` · ${event.location}` : ""}`} tag={event.category} href={event.sourceHref ?? "/calendar"} />
      ));
    }

    return savedPromotions.length === 0 ? <EmptyHubState label="Promos" /> : savedPromotions.map((event) => {
      const status = bookedPromotionIds.includes(event.id) ? "Booked" : interestedPromotionIds.includes(event.id) ? "Interested" : "Saved";
      return <HubRow key={event.id} icon={<Tickets size={16} />} title={event.title} subtitle={`${event.city} · ${event.startDate}${event.location ? ` · ${event.location}` : ""}`} tag={status} href="/promotions" />;
    });
  };

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-gray-900">{lt("Saved items hub")}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Everything you saved across Landly is grouped by use case for fast review.")}</p>
          </div>
          <Link href="/stamps" className="rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">{lt("Open Stamps")}</Link>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors",
                activeTab === tab.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {tab.icon}
              {lt(tab.label)}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", activeTab === tab.id ? "bg-white/20 text-white" : "bg-white text-gray-500")}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">{renderActiveList()}</div>
      </div>
    </section>
  );
}
