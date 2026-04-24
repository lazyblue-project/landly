"use client";

import Link from "next/link";
import { MapPin, Globe, Layers, Plane, ShoppingBag, Receipt, HeartPulse, CalendarDays, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { i18nConfig } from "@/i18n/config";
import { AppMode } from "@/types";
import { shopStores } from "@/data/shop-stores";
import { careProviders } from "@/data/care-providers";
import { useUiCopy } from "@/lib/ui-copy";
import { useLocalizedText } from "@/lib/text-localizer";

const purposeLabel: Record<string, string> = { tourism: "Tourism", business: "Business", study: "Study", work: "Work", residence: "Long-term residence" };

export function ProfileSummary() {
  const { user, savedPassPlans, savedShopStoreIds, receiptRecords, savedCareProviderIds, calendarEvents, completedStampGoalIds, setMode, setLanguage } = useAppStore();
  const { t } = useUiCopy();
  const { lt } = useLocalizedText();

  const handleModeToggle = () => { const nextMode: AppMode = user.mode === "travel" ? "life" : "travel"; setMode(nextMode); };
  const savedShopStores = shopStores.filter((store) => savedShopStoreIds.includes(store.id));
  const pendingReceipts = receiptRecords.filter((record) => record.refundStatus === "pending" || record.refundStatus === "needs-check");
  const savedCareProviders = careProviders.filter((provider) => savedCareProviderIds.includes(provider.id));

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">{user.name.charAt(0)}</div>
        <div><p className="font-semibold text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{lt(purposeLabel[user.visitPurpose] ?? user.visitPurpose)}</p></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-center gap-3"><Globe size={18} className="text-blue-500" /><div><p className="text-xs text-gray-500">{t("my.language", undefined, "Language")}</p><p className="text-sm font-medium text-gray-900">{i18nConfig.localeLabels[user.language]}</p></div></div><select value={user.language} onChange={(e) => setLanguage(e.target.value as typeof user.language)} className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">{i18nConfig.locales.map((locale) => <option key={locale} value={locale}>{i18nConfig.localeLabels[locale]}</option>)}</select></div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4"><MapPin size={18} className="text-orange-500" /><div><p className="text-xs text-gray-500">{t("my.city", undefined, "Current city")}</p><p className="text-sm font-medium text-gray-900">{lt(user.city)}</p></div></div>
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-center gap-3"><Layers size={18} className="text-emerald-500" /><div><p className="text-xs text-gray-500">{t("my.mode", undefined, "App mode")}</p><p className="text-sm font-medium text-gray-900">{lt(user.mode === "travel" ? "Travel Mode" : "Life Mode")}</p></div></div><button onClick={handleModeToggle} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100">{t("home.switch_mode", undefined, "Switch mode")}</button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-8">
        {[{ count: user.savedPlaceIds.length, label: "Places", color: "text-blue-600" }, { count: user.savedPhraseIds.length, label: "Phrases", color: "text-purple-600" }, { count: savedPassPlans.length, label: "Pass", color: "text-sky-600", icon: <Plane size={16} /> }, { count: savedShopStores.length, label: "Shops", color: "text-emerald-600", icon: <ShoppingBag size={16} /> }, { count: pendingReceipts.length, label: "Pending", color: "text-amber-600", icon: <Receipt size={16} /> }, { count: savedCareProviders.length, label: "Care", color: "text-rose-600", icon: <HeartPulse size={16} /> }, { count: calendarEvents.length, label: "Calendar", color: "text-indigo-600", icon: <CalendarDays size={16} /> }, { count: completedStampGoalIds.length, label: "Stamps", color: "text-violet-600", icon: <Sparkles size={16} /> }].map((item) => <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center">{item.icon ? <div className={`mb-1 inline-flex justify-center ${item.color}`}>{item.icon}</div> : null}<p className={`text-2xl font-bold ${item.color}`}>{item.count}</p><p className="mt-0.5 text-xs text-gray-500">{lt(item.label)}</p></div>)}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-gray-900">{lt("Saved shop stores")}</p><p className="mt-1 text-xs text-gray-500">{lt("Your current Landly Shop shortlist.")}</p></div><Link href="/shop?tab=stores" className="text-xs font-medium text-emerald-700">{lt("Open Shop")}</Link></div><div className="mt-3 space-y-2">{savedShopStores.length === 0 ? <p className="text-sm text-gray-500">{lt("No saved shop stores yet.")}</p> : savedShopStores.slice(0, 3).map((store) => <div key={store.id} className="rounded-xl bg-gray-50 px-3 py-3"><p className="text-sm font-medium text-gray-900">{lt(store.name)}</p><p className="mt-0.5 text-xs text-gray-500">{lt(store.district)} · {lt(store.category)}</p></div>)}</div></div>
      <div className="rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-gray-900">{lt("Receipt tracker")}</p><p className="mt-1 text-xs text-gray-500">{lt("Keep pending and needs-check receipts visible before departure.")}</p></div><Link href="/shop/receipts" className="text-xs font-medium text-amber-700">{lt("Open locker")}</Link></div><div className="mt-3 space-y-2">{pendingReceipts.length === 0 ? <p className="text-sm text-gray-500">{lt("No pending receipts right now.")}</p> : pendingReceipts.slice(0, 3).map((receipt) => <div key={receipt.id} className="rounded-xl bg-gray-50 px-3 py-3"><p className="text-sm font-medium text-gray-900">KRW {receipt.amount.toLocaleString()}</p><p className="mt-0.5 text-xs text-gray-500">{lt(receipt.refundType)} refund · {lt(receipt.refundStatus)}</p></div>)}</div></div>
      <div className="rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-gray-900">{lt("Saved care providers")}</p><p className="mt-1 text-xs text-gray-500">{lt("Keep nearby clinics and pharmacies ready for quick access.")}</p></div><Link href="/care?tab=providers" className="text-xs font-medium text-rose-700">{lt("Open Care")}</Link></div><div className="mt-3 space-y-2">{savedCareProviders.length === 0 ? <p className="text-sm text-gray-500">{lt("No saved providers yet.")}</p> : savedCareProviders.slice(0, 3).map((provider) => <div key={provider.id} className="rounded-xl bg-gray-50 px-3 py-3"><p className="text-sm font-medium text-gray-900">{lt(provider.name)}</p><p className="mt-0.5 text-xs text-gray-500">{lt(provider.district)} · {lt(provider.category)}</p></div>)}</div></div>
    </div>
  );
}
