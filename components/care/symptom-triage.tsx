"use client";

import { AlertCircle } from "lucide-react";
import { CareTriageInput } from "@/types";
import { FilterChip } from "@/components/common/filter-chip";
import { useLocalizedText } from "@/lib/text-localizer";

const symptomOptions: { value: CareTriageInput["symptomCategory"]; label: string }[] = [
  { value: "fever-cold", label: "Cold / fever" },
  { value: "stomach", label: "Stomach" },
  { value: "skin", label: "Skin" },
  { value: "dental", label: "Dental" },
  { value: "injury", label: "Injury" },
  { value: "mental-health", label: "Stress / mental health" },
  { value: "checkup", label: "Checkup" },
  { value: "other", label: "Other" },
];

const severityOptions: CareTriageInput["severityLevel"][] = ["mild", "moderate", "severe"];

const redFlagToggles: Array<[keyof CareTriageInput, string]> = [
  ["isBreathingIssue", "Breathing issue"],
  ["isHeavyBleeding", "Heavy bleeding"],
  ["hasChestPain", "Chest pain"],
];

interface SymptomTriageProps {
  value: CareTriageInput;
  onChange: (patch: Partial<CareTriageInput>) => void;
}

export function SymptomTriage({ value, onChange }: SymptomTriageProps) {
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Guided next step")}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {lt("This is not a diagnosis. It helps you choose whether to use emergency help, a hotline, a pharmacy, or a clinic.")}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-xs leading-relaxed text-amber-800">
            {lt("If any red-flag symptom is selected, Landly will prioritize 119 or urgent medical help.")}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">{lt("Emergency red flags")}</p>
          <div className="grid grid-cols-1 gap-2">
            {redFlagToggles.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ [key]: !value[key] } as Partial<CareTriageInput>)}
                className={`rounded-xl border px-3 py-3 text-left text-sm ${value[key] ? "border-rose-500 bg-rose-50 text-rose-700" : "border-gray-200 bg-gray-50 text-gray-600"}`}
              >
                {lt(label)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">{lt("Main concern")}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {symptomOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={lt(option.label)}
                active={value.symptomCategory === option.value}
                onClick={() => onChange({ symptomCategory: option.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">{lt("Severity")}</p>
          <div className="flex gap-2">
            {severityOptions.map((option) => (
              <FilterChip
                key={option}
                label={lt(option)}
                active={value.severityLevel === option}
                onClick={() => onChange({ severityLevel: option })}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ isNightTime: !value.isNightTime })}
            className={`rounded-xl border px-3 py-3 text-left text-sm ${value.isNightTime ? "border-sky-500 bg-sky-50 text-sky-700" : "border-gray-200 bg-gray-50 text-gray-600"}`}
          >
            {lt("Night time")}
          </button>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">{lt("User type")}</p>
            <select
              value={value.userType}
              onChange={(e) => onChange({ userType: e.target.value as CareTriageInput["userType"] })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800"
            >
              <option value="traveler">{lt("Traveler")}</option>
              <option value="resident">{lt("Resident")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
