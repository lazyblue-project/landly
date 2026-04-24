"use client";

import { RefundEligibilityInput } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface RefundCheckerFormProps {
  value: RefundEligibilityInput;
  onChange: (patch: Partial<RefundEligibilityInput>) => void;
}

export function RefundCheckerForm({ value, onChange }: RefundCheckerFormProps) {
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Quick refund check")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-xs text-gray-600">
          {lt("Stay length")}
          <select
            value={value.stayLengthCategory}
            onChange={(e) => onChange({ stayLengthCategory: e.target.value as RefundEligibilityInput["stayLengthCategory"] })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
          >
            <option value="under-6-months">{lt("Under 6 months")}</option>
            <option value="over-6-months">{lt("Over 6 months")}</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-gray-600">
          {lt("Resident status")}
          <select
            value={value.residentStatus}
            onChange={(e) => onChange({ residentStatus: e.target.value as RefundEligibilityInput["residentStatus"] })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
          >
            <option value="tourist">{lt("Tourist")}</option>
            <option value="temporary-stay">{lt("Temporary stay")}</option>
            <option value="resident">{lt("Resident")}</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-gray-600">
          {lt("Purchase amount (KRW)")}
          <input
            type="number"
            value={value.purchaseAmount}
            onChange={(e) => onChange({ purchaseAmount: Number(e.target.value) || 0 })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
          />
        </label>

        <label className="space-y-1 text-xs text-gray-600">
          {lt("Item category")}
          <select
            value={value.itemCategory}
            onChange={(e) => onChange({ itemCategory: e.target.value as RefundEligibilityInput["itemCategory"] })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
          >
            <option value="beauty">{lt("Beauty")}</option>
            <option value="fashion">{lt("Fashion")}</option>
            <option value="grocery">{lt("Grocery / snacks")}</option>
            <option value="souvenir">{lt("Souvenir")}</option>
            <option value="other">{lt("Other")}</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange({ itemOpened: !value.itemOpened })}
          className={`rounded-2xl border px-3 py-3 text-left ${value.itemOpened ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-gray-50 text-gray-700"}`}
        >
          <p className="text-xs uppercase tracking-wide">{lt("Item status")}</p>
          <p className="mt-1 text-sm font-semibold">{value.itemOpened ? lt("Opened / used") : lt("Unopened")}</p>
        </button>

        <button
          type="button"
          onClick={() => onChange({ departureWithin3Months: !value.departureWithin3Months })}
          className={`rounded-2xl border px-3 py-3 text-left ${value.departureWithin3Months ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-700"}`}
        >
          <p className="text-xs uppercase tracking-wide">{lt("Departure timing")}</p>
          <p className="mt-1 text-sm font-semibold">{value.departureWithin3Months ? lt("Leaving within 3 months") : lt("Later than 3 months")}</p>
        </button>
      </div>
    </div>
  );
}
