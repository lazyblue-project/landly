"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopHero } from "@/components/shop/shop-hero";
import { ShopQuickActions } from "@/components/shop/shop-quick-actions";
import { PromotionStrip } from "@/components/shop/promotion-strip";
import { ShopDiscovery } from "@/components/shop/shop-discovery";
import { RefundCheckerForm } from "@/components/shop/refund-checker-form";
import { RefundResultCard } from "@/components/shop/refund-result-card";
import { ReceiptLocker } from "@/components/shop/receipt-locker";
import { DepartureChecklist } from "@/components/shop/departure-checklist";
import { useShopReminder } from "@/hooks/use-shop-reminder";
import { getRefundEligibility } from "@/hooks/use-refund-eligibility";
import { RefundEligibilityInput } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const allowedTabs = new Set(["overview", "stores", "checker", "receipts", "guide"]);
const defaultInput: RefundEligibilityInput = { stayLengthCategory: "under-6-months", purchaseAmount: 30000, itemOpened: false, departureWithin3Months: true, residentStatus: "tourist", itemCategory: "beauty" };

export default function ShopPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialTab = searchParams.get("tab") ?? "overview";
  const activeTab = allowedTabs.has(initialTab) ? initialTab : "overview";
  const [tabValue, setTabValue] = useState(activeTab);
  const [input, setInput] = useState<RefundEligibilityInput>(defaultInput);
  const reminder = useShopReminder();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  useEffect(() => { setTabValue(activeTab); }, [activeTab]);
  const updateTabQuery = (nextTab: string) => { const params = new URLSearchParams(searchParams.toString()); params.set("tab", nextTab); const query = params.toString(); router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }); };
  const handleTabChange = (nextTab: string) => { setTabValue(nextTab); updateTabQuery(nextTab); };
  const result = useMemo(() => getRefundEligibility(input), [input]);

  if (!hasHydrated) {
    return <AppShell><TopBar title={lt("Landly Shop")} /><PageSkeleton /></AppShell>;
  }

  return (
    <AppShell>
      <TopBar title={lt("Landly Shop")} />
      <ShopHero />
      <div className="px-4 py-4">
        <Tabs value={tabValue} onValueChange={handleTabChange} className="gap-4">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-none px-1">
            <TabsTrigger value="overview">{lt("Overview")}</TabsTrigger>
            <TabsTrigger value="stores">{lt("Stores")}</TabsTrigger>
            <TabsTrigger value="checker">{lt("Checker")}</TabsTrigger>
            <TabsTrigger value="receipts">{lt("Receipts")}</TabsTrigger>
            <TabsTrigger value="guide">{lt("Guide")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ShopQuickActions />
            <div className="px-4"><div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><p className="text-sm font-semibold text-gray-900">{lt("Departure reminder")}</p><p className="mt-1 text-sm text-gray-600">{lt(reminder.title)}</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(reminder.description)}</p></div></div>
            <PromotionStrip />
          </TabsContent>
          <TabsContent value="stores" className="space-y-4"><ShopDiscovery /></TabsContent>
          <TabsContent value="checker" className="space-y-4"><RefundCheckerForm value={input} onChange={(patch) => setInput((prev) => ({ ...prev, ...patch }))} /><RefundResultCard result={result} /></TabsContent>
          <TabsContent value="receipts" className="space-y-4"><ReceiptLocker /></TabsContent>
          <TabsContent value="guide" className="space-y-4"><DepartureChecklist /><div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-600 shadow-sm"><p className="font-semibold text-gray-900">{lt("How Landly Shop helps")}</p><p className="mt-2">{lt("Use Landly Shop to understand common tax refund conditions, keep your receipts together, and review departure-day steps before you head to the airport.")}</p><p className="mt-2 text-xs text-gray-500">{lt("Final eligibility and refund approval still depend on official store and airport procedures.")}</p></div></TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
