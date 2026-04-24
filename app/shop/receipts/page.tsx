"use client";

import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { ReceiptLocker } from "@/components/shop/receipt-locker";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function ShopReceiptsPage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Receipt Locker")} />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Receipt Locker")} />
      <div className="px-4 py-4">
        <ReceiptLocker />
      </div>
    </AppShell>
  );
}
