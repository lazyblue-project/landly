"use client";

import { useMemo, useState } from "react";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { TransitType } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface PlannerValue {
  date: string;
  origin: string;
  destination: string;
  transportType: TransitType;
}

interface PassRoutePlannerSheetProps {
  open: boolean;
  onClose: () => void;
  onChooseMap: (value: PlannerValue) => void;
  onSave: (value: PlannerValue) => void;
}

const transportOptions: Array<{ value: TransitType; label: string }> = [
  { value: "airport-rail", label: "Transit / rail" },
  { value: "limousine-bus", label: "Transit / bus" },
  { value: "mixed", label: "Rail + short taxi" },
  { value: "taxi", label: "Taxi / driving" },
];

const todayString = () => new Date().toISOString().slice(0, 10);

export function PassRoutePlannerSheet({ open, onClose, onChooseMap, onSave }: PassRoutePlannerSheetProps) {
  const [value, setValue] = useState<PlannerValue>({ date: todayString(), origin: "Incheon International Airport", destination: "Seoul central", transportType: "airport-rail" });
  const { lt } = useLocalizedText();
  const isValid = useMemo(() => value.date.trim() !== "" && value.origin.trim() !== "" && value.destination.trim() !== "", [value]);
  const update = (patch: Partial<PlannerValue>) => setValue((prev) => ({ ...prev, ...patch }));

  return (
    <BottomSheet open={open} onClose={onClose} title="Plan route to save" description="Save a route with your date, origin, and destination so you can reopen it from Calendar later.">
      <div className="space-y-3">
        <label className="space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Date")}</span><input type="date" value={value.date} onChange={(event) => update({ date: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" /></label>
        <label className="space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Origin")}</span><input type="text" value={value.origin} onChange={(event) => update({ origin: event.target.value })} placeholder={lt("Incheon International Airport")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" /></label>
        <label className="space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Destination")}</span><input type="text" value={value.destination} onChange={(event) => update({ destination: event.target.value })} placeholder={lt("Seoul central")} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" /></label>
        <label className="space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Transport")}</span><select value={value.transportType} onChange={(event) => update({ transportType: event.target.value as TransitType })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none">{transportOptions.map((option) => <option key={option.value} value={option.value}>{lt(option.label)}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button type="button" onClick={() => isValid && onChooseMap(value)} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled={!isValid}>{lt("Choose map app")}</button>
          <button type="button" onClick={() => isValid && onSave(value)} className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50" disabled={!isValid}>{lt("Save to Calendar")}</button>
        </div>
      </div>
    </BottomSheet>
  );
}
