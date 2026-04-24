"use client";

import { StayPlanInput, StayType } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface StayPlanBuilderProps {
  value: StayPlanInput;
  onChange: (patch: Partial<StayPlanInput>) => void;
}

const stayTypeOptions: { value: StayType; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "worker", label: "Worker" },
  { value: "working-holiday", label: "Working holiday" },
  { value: "long-stay", label: "Long stay" },
];

export function StayPlanBuilder({ value, onChange }: StayPlanBuilderProps) {
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Plan builder")}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {lt("Choose the closest stay profile so Landly can surface the right first steps.")}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-gray-700">
          <span className="text-xs font-medium text-gray-500">{lt("Stay type")}</span>
          <select value={value.stayType} onChange={(event) => onChange({ stayType: event.target.value as StayType })} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm">
            {stayTypeOptions.map((option) => <option key={option.value} value={option.value}>{lt(option.label)}</option>)}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-gray-700">
          <span className="text-xs font-medium text-gray-500">{lt("Entry date")}</span>
          <input type="date" value={value.entryDate} onChange={(event) => onChange({ entryDate: event.target.value })} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm" />
        </label>

        <label className="grid gap-1 text-sm text-gray-700">
          <span className="text-xs font-medium text-gray-500">{lt("Region")}</span>
          <input type="text" value={value.region} onChange={(event) => onChange({ region: event.target.value })} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm" placeholder={lt("Seoul")} />
        </label>

        <label className="grid gap-1 text-sm text-gray-700">
          <span className="text-xs font-medium text-gray-500">{lt("Housing status")}</span>
          <select value={value.housingStatus} onChange={(event) => onChange({ housingStatus: event.target.value as StayPlanInput["housingStatus"] })} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm">
            <option value="secured">{lt("Secured")}</option>
            <option value="temporary">{lt("Temporary")}</option>
            <option value="searching">{lt("Searching")}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button onClick={() => onChange({ hasSchool: !value.hasSchool })} className={`rounded-xl border px-3 py-2 text-sm font-medium ${value.hasSchool ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"}`}>{lt("School linked")}</button>
        <button onClick={() => onChange({ hasEmployer: !value.hasEmployer })} className={`rounded-xl border px-3 py-2 text-sm font-medium ${value.hasEmployer ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"}`}>{lt("Employer linked")}</button>
        <button onClick={() => onChange({ withFamily: !value.withFamily })} className={`rounded-xl border px-3 py-2 text-sm font-medium ${value.withFamily ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"}`}>{lt("With family")}</button>
      </div>
    </div>
  );
}
