"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, CheckCircle2, Clipboard, HelpCircle, MapPinned, MessageSquareText, Navigation, PlaneLanding, ShieldCheck, Sparkles } from "lucide-react";
import { ArrivalPlanInput, PassOption, TransitOption } from "@/types";
import { getAirportLabel } from "@/lib/pass-utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface ArrivalAssistantDashboardProps {
  input: ArrivalPlanInput;
  selectedTransitOption?: TransitOption;
  recommendedPass?: PassOption | null;
  onOpenRoute: (option: TransitOption) => void;
  onSavePlan: () => void;
  onOpenRoutePlanner: () => void;
}

function getArrivalFocus(input: ArrivalPlanInput, selectedTransitOption?: TransitOption) {
  if (input.lateNight || input.arrivalTimeBand === "late_night") {
    return {
      label: "Late arrival mode",
      title: "Prioritize a simple, direct route.",
      description: "Keep taxi and tourist help ready before you leave the terminal, especially if trains or buses are limited.",
      badge: "Safety fallback",
    };
  }

  if (input.hasLuggage && input.groupSize >= 2) {
    return {
      label: "Luggage-first mode",
      title: "Choose the route with the fewest stressful transfers.",
      description: "A bus or taxi can be worth more than the cheapest rail route when your group has bags.",
      badge: "Comfort fit",
    };
  }

  if (selectedTransitOption?.type === "airport-rail") {
    return {
      label: "Transit-friendly mode",
      title: "Move fast, but prepare your last-mile fallback.",
      description: "Rail is efficient for many Seoul arrivals, but saving one backup route helps if the final transfer feels confusing.",
      badge: "Value fit",
    };
  }

  return {
    label: "Arrival assistant mode",
    title: "Turn your airport plan into a step-by-step action path.",
    description: "Confirm the route, keep your destination phrase ready, and save the plan before you leave baggage claim.",
    badge: "Ready path",
  };
}

export function ArrivalAssistantDashboard({ input, selectedTransitOption, recommendedPass, onOpenRoute, onSavePlan, onOpenRoutePlanner }: ArrivalAssistantDashboardProps) {
  const { lt } = useLocalizedText();
  const [copied, setCopied] = useState(false);
  const airportLabel = getAirportLabel(input.airport);
  const focus = useMemo(() => getArrivalFocus(input, selectedTransitOption), [input, selectedTransitOption]);
  const destinationPhrase = lt("Please take me to this address.");
  const koreanDestinationPhrase = `이 주소로 가 주세요. 목적지는 ${input.destinationArea}입니다.`;

  const handleCopyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(koreanDestinationPhrase);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const actionSteps = [
    {
      title: "1. Confirm your airport route",
      description: selectedTransitOption ? selectedTransitOption.summary : "Choose one route before leaving the terminal.",
      value: selectedTransitOption?.title ?? "Route not selected yet",
    },
    {
      title: "2. Keep your destination phrase ready",
      description: "Show the Korean phrase to taxi drivers, station staff, or airport information desks.",
      value: input.destinationArea,
    },
    {
      title: "3. Save the first 72-hour checklist",
      description: "After your route is saved, move to the calm-start checklist for SIM, payment, refund, and support tasks.",
      value: "First 72h flow",
    },
  ];

  return (
    <section className="space-y-4 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
            <PlaneLanding size={13} /> {lt("Arrival assistant")}
          </div>
          <h2 className="mt-3 text-lg font-bold leading-tight text-gray-900">{lt(focus.title)}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt(focus.description)}</p>
        </div>
        <div className="rounded-2xl bg-sky-600 p-3 text-white shadow-sm">
          <Navigation size={22} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-white p-3 ring-1 ring-sky-100">
          <p className="font-semibold text-gray-900">{lt("From")}</p>
          <p className="mt-1 leading-relaxed text-gray-600">{lt(airportLabel)}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-sky-100">
          <p className="font-semibold text-gray-900">{lt("To")}</p>
          <p className="mt-1 leading-relaxed text-gray-600">{lt(input.destinationArea)}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-sky-100">
          <p className="font-semibold text-gray-900">{lt("Focus")}</p>
          <p className="mt-1 leading-relaxed text-gray-600">{lt(focus.label)}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-sky-100">
          <p className="font-semibold text-gray-900">{lt("Best pass")}</p>
          <p className="mt-1 leading-relaxed text-gray-600">{recommendedPass ? lt(recommendedPass.title) : lt("Check after route")}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white bg-white/85 p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-900">{lt("Airport action path")}</p>
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700">{lt(focus.badge)}</span>
        </div>
        <div className="space-y-2">
          {actionSteps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{lt(step.title)}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{lt(step.description)}</p>
                  <p className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 ring-1 ring-gray-100">{lt(step.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-2 text-amber-700 shadow-sm"><MessageSquareText size={18} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt("Show this before you move")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{destinationPhrase}</p>
            <p className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold leading-relaxed text-gray-900">{koreanDestinationPhrase}</p>
            <button type="button" onClick={handleCopyPhrase} className="mt-3 inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white">
              <Clipboard size={13} /> {copied ? lt("Copied!") : lt("Copy Korean phrase")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => selectedTransitOption ? onOpenRoute(selectedTransitOption) : onOpenRoutePlanner()} className="inline-flex items-center justify-center gap-1 rounded-2xl bg-sky-600 px-3 py-3 text-sm font-semibold text-white shadow-sm">
          <MapPinned size={15} /> {lt("Open route")}
        </button>
        <button type="button" onClick={onSavePlan} className="inline-flex items-center justify-center gap-1 rounded-2xl border border-sky-200 bg-white px-3 py-3 text-sm font-semibold text-sky-700">
          <CalendarPlus size={15} /> {lt("Save plan")}
        </button>
        <Link href="/pass?tab=first72" className="inline-flex items-center justify-center gap-1 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-700">
          <Sparkles size={15} /> {lt("First 72h")}
        </Link>
        <a href="tel:1330" className="inline-flex items-center justify-center gap-1 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-700">
          <HelpCircle size={15} /> {lt("Call 1330")}
        </a>
      </div>

      <div className="flex items-start gap-2 rounded-2xl bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-500 ring-1 ring-gray-100">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-600" />
        <span>{lt("Landly is a planning guide. Confirm live fares, operating hours, and pickup locations in the official map, station, taxi, or airport channel before you move.")}</span>
      </div>

      <button type="button" onClick={onOpenRoutePlanner} className="inline-flex w-full items-center justify-center gap-1 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white">
        {lt("Create a custom route instead")} <ArrowRight size={15} />
      </button>
    </section>
  );
}
