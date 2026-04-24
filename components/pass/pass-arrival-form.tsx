"use client";

import { ArrivalPlanInput } from "@/types";
import { airportOptions, destinationAreas } from "@/data/pass-data";
import { getRecommendedDestinationPairs } from "@/lib/pass-utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface PassArrivalFormProps {
  value: ArrivalPlanInput;
  onChange: (patch: Partial<ArrivalPlanInput>) => void;
}

export function PassArrivalForm({ value, onChange }: PassArrivalFormProps) {
  const recommendedPairs = getRecommendedDestinationPairs(value.airport);
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Arrival setup")}</p>
        <p className="mt-1 text-xs text-gray-500">{lt("Choose your airport and destination area. If your destination is not listed, type it directly.")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-600">{lt("Airport")}</span>
          <select value={value.airport} onChange={(e) => onChange({ airport: e.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none">
            {airportOptions.map((option) => <option key={option.value} value={option.value}>{lt(option.label)}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-600">{lt("Arrival date")}</span>
          <input type="date" value={value.arrivalDate} onChange={(e) => onChange({ arrivalDate: e.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" />
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-gray-600">{lt("Airport → destination pair")}</span>
          <span className="text-[11px] text-gray-400">{lt("Quick shortcuts")}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendedPairs.map((pair) => (
            <button key={pair} type="button" onClick={() => onChange({ destinationArea: pair })} className={["rounded-full px-3 py-1.5 text-xs font-medium transition-colors", value.destinationArea === pair ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-700 hover:bg-sky-100"].join(" ")}>
              {lt(value.airport)} → {lt(pair)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 space-y-1.5">
          <span className="text-xs font-medium text-gray-600">{lt("Destination area")}</span>
          <input list="landly-destination-areas" type="text" value={value.destinationArea} onChange={(e) => onChange({ destinationArea: e.target.value })} placeholder={lt("Type your hotel area or destination")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" />
          <datalist id="landly-destination-areas">{destinationAreas.map((area) => <option key={area} value={area} />)}</datalist>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-600">{lt("Arrival time")}</span>
          <select value={value.arrivalTimeBand} onChange={(e) => onChange({ arrivalTimeBand: e.target.value as ArrivalPlanInput["arrivalTimeBand"] })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none">
            <option value="morning">{lt("Morning")}</option>
            <option value="afternoon">{lt("Afternoon")}</option>
            <option value="evening">{lt("Evening")}</option>
            <option value="late_night">{lt("Late night")}</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-600">{lt("Group size")}</span>
          <input type="number" min={1} max={6} value={value.groupSize} onChange={(e) => onChange({ groupSize: Number(e.target.value) || 1 })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        <label className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"><input type="checkbox" checked={value.hasLuggage} onChange={(e) => onChange({ hasLuggage: e.target.checked })} />{lt("Carrying luggage")}</label>
        <label className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"><input type="checkbox" checked={value.lateNight} onChange={(e) => onChange({ lateNight: e.target.checked })} />{lt("Late-night arrival")}</label>
      </div>
    </div>
  );
}
