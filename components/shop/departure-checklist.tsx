"use client";

import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const items = [
  "Bring your passport and check stored receipts.",
  "Keep eligible items unopened until departure.",
  "Allow extra airport time if you still need to process general refund steps.",
  "Check whether your refund can be handled downtown, kiosk, or airport counter.",
  "Review baggage and customs order before you queue.",
];

export function DepartureChecklist() {
  const { departureDate, setDepartureDate, receiptRecords } = useAppStore();
  const pendingCount = receiptRecords.filter((item) => item.refundStatus === "pending" || item.refundStatus === "needs-check").length;
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Departure refund checklist")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Set your departure date and keep an eye on any receipt still marked pending.")}
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          {pendingCount} {lt("pending")}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs text-gray-600">{lt("Departure date")}</label>
        <input
          type="date"
          value={departureDate ?? ""}
          onChange={(e) => setDepartureDate(e.target.value || undefined)}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900"
        />
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item, index) => (
          <div key={item} className="flex gap-3 rounded-2xl bg-gray-50 px-3 py-3 text-sm text-gray-700">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-500">{index + 1}</div>
            <p className="leading-relaxed">{lt(item)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
