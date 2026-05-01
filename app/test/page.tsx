"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, HeartPulse, Languages, LifeBuoy, LockKeyhole, MessageSquareText, Plane, ReceiptText, ShieldAlert, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { FeedbackPrompt } from "@/components/common/feedback-prompt";
import { BetaFeedbackKit } from "@/components/test/beta-feedback-kit";
import { BetaFeedbackNotebook } from "@/components/test/beta-feedback-notebook";
import { BetaReportExportPanel } from "@/components/test/beta-report-export-panel";
import { BetaMissionCard } from "@/components/test/beta-mission-card";
import { BetaTestCommandCenter } from "@/components/test/beta-test-command-center";
import { PilotQaChecklist } from "@/components/test/pilot-qa-checklist";
import { getOnboardingLaunchAction } from "@/data/onboarding-launch-actions";
import { pilotQaChecks } from "@/data/pilot-qa-checks";
import { useAppStore } from "@/store/app-store";
import type { BetaMissionId } from "@/types";
import { isBetaToolsEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface BetaMission {
  id: BetaMissionId;
  title: string;
  persona: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: "sky" | "emerald" | "rose" | "amber" | "violet" | "gray";
  timeBox: string;
  successMetric: string;
  checkpoints: string[];
}

const missions: BetaMission[] = [
  {
    id: "arrival",
    title: "Arrival survival test",
    persona: "First-time tourist",
    description: "Act like you just landed at Incheon and need a calm route plus the first 72-hour checklist.",
    href: "/pass?tab=first72",
    icon: Plane,
    tone: "sky",
    timeBox: "3–5 minutes",
    successMetric: "Tester can explain the next route step without asking for help.",
    checkpoints: ["Find the airport route area", "Open the first 72-hour checklist", "Save or review one route-related action"],
  },
  {
    id: "shop",
    title: "Shopping refund test",
    persona: "Shopping traveler",
    description: "Act like you bought cosmetics and want to know whether to save the receipt before leaving Korea.",
    href: "/shop?tab=receipts",
    icon: ReceiptText,
    tone: "emerald",
    timeBox: "4–6 minutes",
    successMetric: "Tester understands refund readiness and what to check before departure.",
    checkpoints: ["Open the receipt locker", "Review refund readiness", "Check what still needs passport or store confirmation"],
  },
  {
    id: "care",
    title: "Pharmacy and clinic test",
    persona: "Traveler who feels sick",
    description: "Act like you have mild symptoms and need to decide between pharmacy, clinic, or urgent help.",
    href: "/care?tab=triage",
    icon: HeartPulse,
    tone: "rose",
    timeBox: "4–7 minutes",
    successMetric: "Tester can separate emergency steps from ordinary care steps.",
    checkpoints: ["Review emergency red flags", "Complete symptom guide", "Open one care phrase or provider card"],
  },
  {
    id: "sos",
    title: "Emergency clarity test",
    persona: "Lost item or urgent moment",
    description: "Act like you lost a passport or need help late at night and must act without reading too much.",
    href: "/sos",
    icon: ShieldAlert,
    tone: "amber",
    timeBox: "2–4 minutes",
    successMetric: "Tester finds the right hotline and Korean phrase within a few taps.",
    checkpoints: ["Find 112, 119, or 1330", "Open a scenario", "Show or copy an emergency phrase"],
  },
  {
    id: "stay",
    title: "First 90 days test",
    persona: "Student or long-stay resident",
    description: "Act like you will stay more than 90 days and need a simple settlement plan.",
    href: "/stay?tab=first90",
    icon: LifeBuoy,
    tone: "violet",
    timeBox: "5–8 minutes",
    successMetric: "Tester knows which document or deadline to handle next.",
    checkpoints: ["Open the 90-day timeline", "Add or review one document note", "Send one checkpoint to Calendar"],
  },
  {
    id: "assistant",
    title: "Show-to-someone phrase test",
    persona: "Non-Korean speaker",
    description: "Act like you need to show a phrase to a taxi driver, pharmacist, or shop staff.",
    href: "/assistant",
    icon: Languages,
    tone: "gray",
    timeBox: "2–3 minutes",
    successMetric: "Tester can find and show a Korean phrase without confusion.",
    checkpoints: ["Pick a situation card", "Open a large phrase view", "Save or copy one useful phrase"],
  },
];

const betaMissionIds: BetaMissionId[] = ["arrival", "shop", "care", "sos", "stay", "assistant"];

function isBetaMissionId(value: string | null): value is BetaMissionId {
  return betaMissionIds.includes(value as BetaMissionId);
}

const testerBrief = [
  "Use one mission as a real scenario, not as a menu tour.",
  "Record the first point where you feel unsure.",
  "Check whether the next action is obvious within 10 seconds.",
  "Save a feedback note before sending the final report.",
];

export default function TestPage() {
  const { lt } = useLocalizedText();
  const [missionParam, setMissionParam] = useState<string | null>(null);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const user = useAppStore((state) => state.user);
  const receiptCount = useAppStore((state) => state.receiptRecords.length);
  const calendarCount = useAppStore((state) => state.calendarEvents.length);
  const savedPhraseCount = useAppStore((state) => state.user.savedPhraseIds.length);
  const savedPlaceCount = useAppStore((state) => state.user.savedPlaceIds.length);
  const completedBetaMissionIds = useAppStore((state) => state.completedBetaMissionIds);
  const betaFeedbackRecords = useAppStore((state) => state.betaFeedbackRecords);
  const completedPilotQaCheckIds = useAppStore((state) => state.completedPilotQaCheckIds);
  const isBetaTester = useAppStore((state) => state.isBetaTester);
  const setBetaTester = useAppStore((state) => state.setBetaTester);
  const togglePilotQaCheck = useAppStore((state) => state.togglePilotQaCheck);
  const toggleBetaMissionCompleted = useAppStore((state) => state.toggleBetaMissionCompleted);
  const addBetaFeedbackRecord = useAppStore((state) => state.addBetaFeedbackRecord);
  const removeBetaFeedbackRecord = useAppStore((state) => state.removeBetaFeedbackRecord);

  const launchAction = getOnboardingLaunchAction({
    purpose: user.visitPurpose,
    duration: user.stayDuration,
    firstNeed: user.firstNeed,
  });
  useEffect(() => {
    setMissionParam(new URLSearchParams(window.location.search).get("mission"));
  }, []);

  const highlightedMissionId = isBetaMissionId(missionParam) ? missionParam : launchAction.betaMissionId;
  const highlightedMission = missions.find((mission) => mission.id === highlightedMissionId);

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Beta test guide")} />
        <PageSkeleton />
      </AppShell>
    );
  }

  if (!isBetaToolsEnabled(isBetaTester)) {
    return (
      <AppShell>
        <TopBar title={lt("Beta test guide")} showBack />
        <div className="px-4 py-4">
          <section className="rounded-3xl border border-gray-100 bg-white p-5 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">
              <LockKeyhole size={20} />
            </div>
            <p className="mt-4 text-base font-bold text-gray-950">{lt("Beta tools are hidden")}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {lt("This testing guide is separated from the regular product experience. Enable NEXT_PUBLIC_ENABLE_BETA_TOOLS=true for tester builds.")}
            </p>
          </section>
        </div>
      </AppShell>
    );
  }

  const completedCount = missions.filter((mission) => completedBetaMissionIds.includes(mission.id)).length;

  return (
    <AppShell>
      <TopBar title={lt("Beta test guide")} />
      <div className="space-y-4 px-4 py-4">
        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-100 p-2 text-blue-600">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{lt("Landly beta")}</p>
              <h1 className="mt-1 text-xl font-bold text-gray-950">{lt("Test Landly like a real visitor")}</h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {lt("Give testers one clear mission, then ask whether Landly made the next action easier, safer, or faster.")}
              </p>
            </div>
          </div>
        </section>

        <BetaTestCommandCenter completedCount={completedCount} feedbackCount={betaFeedbackRecords.length} missionTotal={missions.length} />

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{lt("Home access")}</p>
              <h2 className="mt-1 text-base font-bold text-gray-950">{lt("Show beta panel on Home")}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {lt("Keep test missions hidden from regular users unless this local tester switch is on.")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBetaTester(!isBetaTester)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold ring-1 transition-colors",
                isBetaTester
                  ? "bg-violet-50 text-violet-700 ring-violet-100"
                  : "bg-gray-50 text-gray-500 ring-gray-100"
              )}
            >
              {isBetaTester ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {lt(isBetaTester ? "On" : "Off")}
            </button>
          </div>
        </section>

        <PilotQaChecklist
          checks={pilotQaChecks}
          completedIds={completedPilotQaCheckIds}
          onToggle={togglePilotQaCheck}
        />

        {highlightedMission ? (
          <section className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-2 text-violet-600 ring-1 ring-violet-100">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">{lt("Recommended from onboarding")}</p>
                <h2 className="mt-1 text-base font-bold text-gray-950">{lt(highlightedMission.title)}</h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Start with the mission that matches the user's first stated need, then record one note.")}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={highlightedMission.href} className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]">
                {lt("Open linked flow")}
              </Link>
              <Link href={`#mission-${highlightedMission.id}`} className="inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 active:scale-[0.99]">
                {lt("View mission card")}
              </Link>
            </div>
          </section>
        ) : null}

        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">{lt("Current mode")}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{lt(user.mode === "life" ? "Life Mode" : "Travel Mode")}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">{lt("Tester language")}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{user.language.toUpperCase()}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">{lt("Saved toolkit")}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{savedPhraseCount + savedPlaceCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">{lt("Receipts / dates")}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{receiptCount} / {calendarCount}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText size={18} className="text-gray-700" />
            <p className="text-sm font-semibold text-gray-900">{lt("How to run the test")}</p>
          </div>
          <div className="mt-3 space-y-2">
            {testerBrief.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">{index + 1}</span>
                <span>{lt(item)}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-3">
          {missions.map((mission) => (
            <BetaMissionCard
              key={mission.id}
              {...mission}
              completed={completedBetaMissionIds.includes(mission.id)}
              highlighted={mission.id === highlightedMissionId}
              onToggleComplete={toggleBetaMissionCompleted}
            />
          ))}
        </div>

        <BetaFeedbackNotebook
          missions={missions.map((mission) => ({ id: mission.id, title: mission.title }))}
          records={betaFeedbackRecords}
          onAdd={addBetaFeedbackRecord}
          onRemove={removeBetaFeedbackRecord}
          defaultMissionId={highlightedMissionId}
        />

        <BetaReportExportPanel
          missions={missions.map((mission) => ({ id: mission.id, title: mission.title }))}
          records={betaFeedbackRecords}
          completedMissionIds={completedBetaMissionIds}
          qaChecks={pilotQaChecks}
          completedQaCheckIds={completedPilotQaCheckIds}
          modeLabel={user.mode}
          languageLabel={user.language}
        />

        <BetaFeedbackKit />

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-gray-100 p-2 text-gray-700">
              <CalendarDays size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{lt("After testing")}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {lt("Review My to see whether saved phrases, receipts, documents, and dates were easy to find again.")}
              </p>
            </div>
          </div>
          <Link href="/my" className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 active:scale-[0.99]">
            {lt("Open My command center")}
          </Link>
        </section>
      </div>
      <FeedbackPrompt context="Beta test guide" compact />
    </AppShell>
  );
}
