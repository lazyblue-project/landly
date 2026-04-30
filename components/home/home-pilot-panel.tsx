"use client";

import Link from "next/link";
import { ArrowRight, BadgePercent, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import { getOnboardingLaunchAction } from "@/data/onboarding-launch-actions";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export function HomePilotPanel() {
  const user = useAppStore((state) => state.user);
  const completedBetaMissionIds = useAppStore((state) => state.completedBetaMissionIds);
  const betaFeedbackCount = useAppStore((state) => state.betaFeedbackRecords.length);
  const acknowledgedPartnerDisclosureIds = useAppStore((state) => state.acknowledgedPartnerDisclosureIds);
  const { lt } = useLocalizedText();

  const action = getOnboardingLaunchAction({
    purpose: user.visitPurpose,
    duration: user.stayDuration,
    firstNeed: user.firstNeed,
  });
  const missionCompleted = completedBetaMissionIds.includes(action.betaMissionId);
  const disclosureCount = acknowledgedPartnerDisclosureIds.length;

  return (
    <section className="px-4 pt-4">
      <div className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-600">{lt("Pilot loop")}</p>
            <h2 className="mt-1 text-lg font-black text-gray-950">{lt("Test this journey, then disclose partners")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("Your onboarding choice now connects to a focused beta mission and a transparent partner lane.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-violet-600 ring-1 ring-violet-100">
            <Sparkles size={19} />
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-gray-100">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-2 text-blue-700 ring-1 ring-blue-100">
              <ClipboardCheck size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{lt("Recommended pilot")}</p>
              <h3 className="mt-1 text-base font-black text-gray-950">{lt(action.title)}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(action.description)}</p>
            </div>
            <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-600 ring-1 ring-gray-100">
              {lt(missionCompleted ? "Tested" : "Not tested")}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={action.betaHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-3 py-3 text-sm font-bold text-white active:scale-[0.99]">
              {lt(action.betaLabel)}
              <ArrowRight size={14} />
            </Link>
            <Link href={action.partnerHref} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-800 active:scale-[0.99]">
              {lt("Partner lane")}
              <BadgePercent size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-2xl bg-white/80 p-3 ring-1 ring-gray-100">
            <p className="text-gray-500">{lt("Feedback notes")}</p>
            <p className="mt-1 text-lg font-black text-gray-950">{betaFeedbackCount}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-3 ring-1 ring-gray-100">
            <p className="text-gray-500">{lt("Disclosures")}</p>
            <p className="mt-1 text-lg font-black text-gray-950">{disclosureCount}</p>
          </div>
          <Link href="/trust" className="rounded-2xl bg-white/80 p-3 text-gray-700 ring-1 ring-gray-100">
            <ShieldCheck size={14} className="text-emerald-600" />
            <p className="mt-1 font-bold">{lt("Trust rules")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
