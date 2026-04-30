"use client";

import type { ReceiptRecord, ShopStore } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SwipeActionRow } from "@/components/common/swipe-action-row";
import { useAppStore } from "@/store/app-store";
import { triggerHaptic } from "@/lib/haptics";
import { getReceiptConfidence, getReceiptEstimatedRefund } from "@/lib/shop-utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface ReceiptCardProps {
  receipt: ReceiptRecord;
  store?: ShopStore;
}

const confidenceClass = {
  high: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-red-50 text-red-700",
};

export function ReceiptCard({ receipt, store }: ReceiptCardProps) {
  const { updateReceiptStatus, updateReceiptRecord, removeReceiptRecord, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();
  const confidence = getReceiptConfidence(receipt);
  const estimatedRefund = getReceiptEstimatedRefund(receipt);
  const displayStoreName = store?.name ?? receipt.storeName ?? lt("Unlinked receipt");

  const handleMarkDone = () => {
    updateReceiptStatus(receipt.id, "done");
    triggerHaptic("success");
    showSnackbar(lt("Receipt marked as done."), "success");
  };

  const handleNeedsCheck = () => {
    updateReceiptStatus(receipt.id, "needs-check");
    triggerHaptic("warning");
    showSnackbar(lt("Receipt moved to needs check."), "warning");
  };

  const handlePassportReady = () => {
    updateReceiptRecord(receipt.id, { passportReady: true, refundConfidence: receipt.refundConfidence ?? "medium" });
    triggerHaptic("success");
    showSnackbar(lt("Passport status marked ready."), "success");
  };

  const handleDelete = () => {
    removeReceiptRecord(receipt.id);
    triggerHaptic("warning");
    showSnackbar(lt("Receipt removed."), "default");
  };

  return (
    <SwipeActionRow
      actions={
        <>
          <button type="button" onClick={handleMarkDone} className="flex-1 rounded-2xl bg-emerald-600 px-2 text-xs font-semibold text-white">
            {lt("Done")}
          </button>
          <button type="button" onClick={handleDelete} className="flex-1 rounded-2xl bg-red-600 px-2 text-xs font-semibold text-white">
            {lt("Delete")}
          </button>
        </>
      }
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{lt(displayStoreName)}</p>
            <p className="mt-1 text-xs text-gray-500">{receipt.purchaseDate} · ₩{receipt.amount.toLocaleString()}</p>
          </div>
          <Badge variant={receipt.refundStatus === "done" ? "secondary" : "outline"}>{lt(receipt.refundStatus)}</Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-gray-50 px-3 py-2">
            <p className="text-[11px] text-gray-500">{lt("Estimated refund")}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">₩{estimatedRefund.toLocaleString()}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2 ${confidenceClass[confidence]}`}>
            <p className="text-[11px] opacity-80">{lt("Refund confidence")}</p>
            <p className="mt-0.5 text-sm font-semibold">{lt(confidence)}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline">{lt(receipt.refundType)}</Badge>
          {receipt.itemCategory ? <Badge variant="outline">{lt(receipt.itemCategory)}</Badge> : null}
          <Badge variant={receipt.passportReady ? "secondary" : "outline"}>
            {receipt.passportReady ? lt("Passport ready") : lt("Passport needed")}
          </Badge>
        </div>

        {receipt.note ? <p className="mt-3 text-sm text-gray-600">{lt(receipt.note)}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {receipt.refundStatus !== "done" && (
            <button type="button" onClick={handleMarkDone} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-transform active:scale-[0.97]">
              {lt("Mark done")}
            </button>
          )}
          {!receipt.passportReady && receipt.refundStatus !== "done" && (
            <button type="button" onClick={handlePassportReady} className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition-transform active:scale-[0.97]">
              {lt("Passport ready")}
            </button>
          )}
          {receipt.refundStatus !== "needs-check" && receipt.refundStatus !== "done" && (
            <button type="button" onClick={handleNeedsCheck} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-transform active:scale-[0.97]">
              {lt("Needs check")}
            </button>
          )}
          <button type="button" onClick={handleDelete} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-transform active:scale-[0.97]">
            {lt("Delete")}
          </button>
        </div>
      </div>
    </SwipeActionRow>
  );
}
