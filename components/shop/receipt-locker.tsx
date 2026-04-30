"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Camera, ReceiptText, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { shopStores } from "@/data/shop-stores";
import { useAppStore } from "@/store/app-store";
import { triggerHaptic } from "@/lib/haptics";
import type { ReceiptRecord, RefundConfidence, RefundEligibilityInput, ReceiptRefundStatus, ShopRefundType } from "@/types";
import { estimateRefundAmount, getReceiptEstimatedRefund } from "@/lib/shop-utils";
import { ReceiptCard } from "./receipt-card";
import { useLocalizedText } from "@/lib/text-localizer";

const statusOptions: Array<ReceiptRefundStatus | "all"> = ["all", "pending", "needs-check", "done", "not-eligible"];
const categoryOptions: RefundEligibilityInput["itemCategory"][] = ["beauty", "fashion", "grocery", "souvenir", "other"];

interface ReceiptFormState {
  storeId: string;
  storeName: string;
  amount: string;
  purchaseDate: string;
  itemCategory: RefundEligibilityInput["itemCategory"];
  refundType: Exclude<ShopRefundType, "both">;
  refundStatus: ReceiptRefundStatus;
  refundConfidence: RefundConfidence;
  passportReady: boolean;
  note: string;
}

interface ScanPreset {
  label: string;
  description: string;
  patch: Partial<ReceiptFormState>;
}

function getInitialFormState(): ReceiptFormState {
  return {
    storeId: "",
    storeName: "",
    amount: "32000",
    purchaseDate: new Date().toISOString().slice(0, 10),
    itemCategory: "beauty",
    refundType: "general",
    refundStatus: "pending",
    refundConfidence: "medium",
    passportReady: false,
    note: "",
  };
}

function getStoreRefundType(storeId: string): Exclude<ShopRefundType, "both"> {
  const store = shopStores.find((item) => item.id === storeId);
  if (!store) return "general";
  if (store.refundType === "immediate") return "immediate";
  if (store.refundType === "unknown") return "unknown";
  return "general";
}

const scanPresets: ScanPreset[] = [
  {
    label: "Beauty receipt scan",
    description: "Auto-fills an Olive Young style refund receipt.",
    patch: {
      storeId: "shop_001",
      amount: "48000",
      itemCategory: "beauty",
      refundType: "immediate",
      refundStatus: "pending",
      refundConfidence: "high",
      passportReady: true,
      note: "Mock scan: passport checked at checkout. Keep receipt until departure.",
    },
  },
  {
    label: "Department store scan",
    description: "Creates a general refund receipt that needs airport review.",
    patch: {
      storeId: "shop_004",
      amount: "158000",
      itemCategory: "fashion",
      refundType: "general",
      refundStatus: "needs-check",
      refundConfidence: "medium",
      passportReady: false,
      note: "Mock scan: check refund counter, kiosk, or airport process before departure.",
    },
  },
  {
    label: "Convenience store scan",
    description: "Quick-fills a small snack or gift purchase.",
    patch: {
      storeId: "shop_006",
      amount: "33000",
      itemCategory: "grocery",
      refundType: "immediate",
      refundStatus: "pending",
      refundConfidence: "medium",
      passportReady: false,
      note: "Mock scan: confirm minimum amount and passport requirement with the store.",
    },
  },
];

export function ReceiptLocker() {
  const { receiptRecords, addReceiptRecord, showSnackbar } = useAppStore();
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ReceiptFormState>(() => getInitialFormState());
  const { lt } = useLocalizedText();

  const filtered = useMemo(
    () => (status === "all" ? receiptRecords : receiptRecords.filter((item) => item.refundStatus === status)),
    [receiptRecords, status]
  );

  const summary = useMemo(() => {
    const activeReceipts = receiptRecords.filter((receipt) => receipt.refundStatus !== "not-eligible");
    return {
      activeCount: activeReceipts.length,
      estimatedRefund: activeReceipts.reduce((total, receipt) => total + getReceiptEstimatedRefund(receipt), 0),
      needsPassport: activeReceipts.filter((receipt) => !receipt.passportReady && receipt.refundStatus !== "done").length,
    };
  }, [receiptRecords]);

  const selectedStore = shopStores.find((store) => store.id === form.storeId);

  const handleStoreChange = (storeId: string) => {
    const store = shopStores.find((item) => item.id === storeId);
    setForm((prev) => ({
      ...prev,
      storeId,
      storeName: store ? "" : prev.storeName,
      refundType: getStoreRefundType(storeId),
      refundConfidence: store?.refundType === "immediate" ? "high" : prev.refundConfidence,
      passportReady: store?.passportNeededAtCheckout ? prev.passportReady : prev.passportReady,
    }));
  };

  const applyScanPreset = (preset: ScanPreset) => {
    setForm({
      ...getInitialFormState(),
      ...preset.patch,
      purchaseDate: new Date().toISOString().slice(0, 10),
    });
    setFormOpen(true);
    triggerHaptic("success");
    showSnackbar(lt("Mock receipt scan filled the form."), "success");
  };

  const getStatusCount = (option: ReceiptRefundStatus | "all") => {
    if (option === "all") return receiptRecords.length;
    return receiptRecords.filter((receipt) => receipt.refundStatus === option).length;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      showSnackbar(lt("Enter a valid purchase amount."), "warning");
      return;
    }

    const newRecord: ReceiptRecord = {
      id: `receipt_${Date.now()}`,
      storeId: form.storeId || undefined,
      storeName: selectedStore ? undefined : form.storeName.trim() || undefined,
      purchaseDate: form.purchaseDate,
      amount,
      itemCategory: form.itemCategory,
      refundType: form.refundType,
      refundStatus: form.refundStatus,
      refundConfidence: form.refundConfidence,
      estimatedRefundAmount: estimateRefundAmount(amount),
      passportReady: form.passportReady,
      note: form.note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addReceiptRecord(newRecord);
    setForm(getInitialFormState());
    setFormOpen(false);
    triggerHaptic("success");
    showSnackbar(lt("Receipt saved to refund wallet."), "success");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Refund Wallet")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Save receipts, track airport readiness, and avoid losing refund steps.")}</p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen((value) => !value)}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-transform active:scale-[0.97]"
          >
            {formOpen ? lt("Close") : lt("Add receipt")}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-emerald-50 px-3 py-2">
            <p className="text-[11px] text-emerald-700">{lt("Active receipts")}</p>
            <p className="mt-0.5 text-sm font-bold text-emerald-950">{summary.activeCount}</p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-3 py-2">
            <p className="text-[11px] text-sky-700">{lt("Est. refund")}</p>
            <p className="mt-0.5 truncate text-sm font-bold text-sky-950">₩{summary.estimatedRefund.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-3 py-2">
            <p className="text-[11px] text-amber-700">{lt("Passport check")}</p>
            <p className="mt-0.5 text-sm font-bold text-amber-950">{summary.needsPassport}</p>
          </div>
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
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${status === option ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {lt(option)} <span className="opacity-70">{getStatusCount(option)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-2.5 text-emerald-700 shadow-sm">
            <Camera size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt("Mock receipt scan")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {lt("Try a scan-like flow that fills the form with realistic refund details. Replace it with OCR later.")}
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {scanPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyScanPreset(preset)}
              className="flex items-start gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow-sm transition-transform active:scale-[0.98]"
            >
              <Sparkles size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-gray-900">{lt(preset.label)}</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-500">{lt(preset.description)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
              <ReceiptText size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{lt("Add refund receipt")}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Save the amount, store, refund type, and passport readiness before airport day.")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs text-gray-600">
              {lt("Store")}
              <select
                value={form.storeId}
                onChange={(event) => handleStoreChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              >
                <option value="">{lt("Manual store")}</option>
                {shopStores.map((store) => (
                  <option key={store.id} value={store.id}>{lt(store.name)}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-xs text-gray-600">
              {lt("Purchase date")}
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(event) => setForm((prev) => ({ ...prev, purchaseDate: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              />
            </label>

            {!form.storeId ? (
              <label className="col-span-2 space-y-1 text-xs text-gray-600">
                {lt("Store name")}
                <input
                  value={form.storeName}
                  onChange={(event) => setForm((prev) => ({ ...prev, storeName: event.target.value }))}
                  placeholder={lt("Type store name")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </label>
            ) : null}

            <label className="space-y-1 text-xs text-gray-600">
              {lt("Purchase amount (KRW)")}
              <input
                type="number"
                min={0}
                value={form.amount}
                onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              />
            </label>

            <label className="space-y-1 text-xs text-gray-600">
              {lt("Item category")}
              <select
                value={form.itemCategory}
                onChange={(event) => setForm((prev) => ({ ...prev, itemCategory: event.target.value as RefundEligibilityInput["itemCategory"] }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              >
                {categoryOptions.map((option) => <option key={option} value={option}>{lt(option)}</option>)}
              </select>
            </label>

            <label className="space-y-1 text-xs text-gray-600">
              {lt("Refund type")}
              <select
                value={form.refundType}
                onChange={(event) => setForm((prev) => ({ ...prev, refundType: event.target.value as ReceiptFormState["refundType"] }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              >
                <option value="immediate">{lt("immediate")}</option>
                <option value="general">{lt("general")}</option>
                <option value="unknown">{lt("unknown")}</option>
              </select>
            </label>

            <label className="space-y-1 text-xs text-gray-600">
              {lt("Refund status")}
              <select
                value={form.refundStatus}
                onChange={(event) => setForm((prev) => ({ ...prev, refundStatus: event.target.value as ReceiptRefundStatus }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              >
                <option value="pending">{lt("pending")}</option>
                <option value="needs-check">{lt("needs-check")}</option>
                <option value="done">{lt("done")}</option>
                <option value="not-eligible">{lt("not-eligible")}</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, passportReady: !prev.passportReady }))}
            className={`w-full rounded-2xl border px-3 py-3 text-left ${form.passportReady ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
          >
            <p className="text-xs uppercase tracking-wide">{lt("Passport readiness")}</p>
            <p className="mt-1 text-sm font-semibold">{form.passportReady ? lt("Passport checked at purchase") : lt("Need to confirm passport / refund counter")}</p>
          </button>

          <label className="space-y-1 text-xs text-gray-600">
            {lt("Note")}
            <textarea
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
              placeholder={lt("Example: Keep product unopened until airport.")}
              className="min-h-20 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
            />
          </label>

          <button type="submit" className="w-full rounded-xl bg-gray-900 px-3 py-3 text-sm font-semibold text-white">
            {lt("Save receipt")}
          </button>
        </form>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState title={lt("No receipts in this status")} description={lt("Use the mock scan or add a receipt manually after checkout.")} />
      ) : (
        filtered.map((receipt) => (
          <ReceiptCard key={receipt.id} receipt={receipt} store={shopStores.find((store) => store.id === receipt.storeId)} />
        ))
      )}
    </div>
  );
}
