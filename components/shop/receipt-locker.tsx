"use client";

import { useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { shopStores } from "@/data/shop-stores";
import { useAppStore } from "@/store/app-store";
import { triggerHaptic } from "@/lib/haptics";
import { ReceiptRecord } from "@/types";
import { ReceiptCard } from "./receipt-card";
import { useLocalizedText } from "@/lib/text-localizer";

const statusOptions: Array<ReceiptRecord["refundStatus"] | "all"> = ["all", "pending", "needs-check", "done", "not-eligible"];

export function ReceiptLocker() {
  const { receiptRecords, addReceiptRecord, showSnackbar } = useAppStore();
  const [status, setStatus] = useState<typeof statusOptions[number]>("all");
  const { lt } = useLocalizedText();

  const filtered = status === "all" ? receiptRecords : receiptRecords.filter((item) => item.refundStatus === status);

  const handleAddSample = () => {
    addReceiptRecord({
      id: `receipt_${Date.now()}`,
      purchaseDate: new Date().toISOString().slice(0, 10),
      amount: 32000,
      refundType: "general",
      refundStatus: "pending",
      note: "Add the real receipt photo later.",
      storeId: "shop_008",
    });
    triggerHaptic("success");
    showSnackbar(lt("Receipt saved to locker."), "success");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Receipt locker")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Keep refund notes together until airport day.")}</p>
          </div>
          <button type="button" onClick={handleAddSample} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-transform active:scale-[0.97]">
            {lt("Add receipt")}
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {statusOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setStatus(option);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${status === option ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {lt(option)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={lt("No receipts in this status")} />
      ) : (
        filtered.map((receipt) => (
          <ReceiptCard key={receipt.id} receipt={receipt} store={shopStores.find((store) => store.id === receipt.storeId)} />
        ))
      )}
    </div>
  );
}
