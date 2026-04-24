"use client";

import { ReceiptRecord, ShopStore } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SwipeActionRow } from "@/components/common/swipe-action-row";
import { useAppStore } from "@/store/app-store";
import { triggerHaptic } from "@/lib/haptics";
import { useLocalizedText } from "@/lib/text-localizer";

interface ReceiptCardProps {
  receipt: ReceiptRecord;
  store?: ShopStore;
}

export function ReceiptCard({ receipt, store }: ReceiptCardProps) {
  const { updateReceiptStatus, removeReceiptRecord, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();

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
          <div>
            <p className="text-sm font-semibold text-gray-900">{store?.name ?? lt("Unlinked receipt")}</p>
            <p className="mt-1 text-xs text-gray-500">{receipt.purchaseDate} · ₩{receipt.amount.toLocaleString()}</p>
          </div>
          <Badge variant={receipt.refundStatus === "done" ? "secondary" : "outline"}>{lt(receipt.refundStatus)}</Badge>
        </div>

        {receipt.note ? <p className="mt-3 text-sm text-gray-600">{lt(receipt.note)}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {receipt.refundStatus !== "done" && (
            <button type="button" onClick={handleMarkDone} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-transform active:scale-[0.97]">
              {lt("Mark done")}
            </button>
          )}
          {receipt.refundStatus !== "needs-check" && (
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
