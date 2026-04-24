import { useMemo } from "react";
import { useAppStore } from "@/store/app-store";

export function useShopReminder() {
  const { receiptRecords, departureDate } = useAppStore();

  return useMemo(() => {
    const pendingCount = receiptRecords.filter((item) => item.refundStatus === "pending" || item.refundStatus === "needs-check").length;
    const hasReminder = Boolean(departureDate && pendingCount > 0);

    return {
      pendingCount,
      hasReminder,
      title: hasReminder
        ? `Check ${pendingCount} receipt${pendingCount > 1 ? "s" : ""} before departure`
        : "Save receipts to review refund steps later",
      description: hasReminder
        ? `You marked ${pendingCount} shopping receipt${pendingCount > 1 ? "s" : ""} as still needing attention.`
        : "Landly Shop can keep your purchase notes together until your airport day.",
    };
  }, [departureDate, receiptRecords]);
}
