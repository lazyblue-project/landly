"use client";

import Link from "next/link";
import { AlertTriangle, CalendarPlus, CheckCircle2, Clock3, FileText, Landmark, ShieldCheck, type LucideIcon } from "lucide-react";
import { lifeChecklist } from "@/data/life-checklist";
import { useAppStore } from "@/store/app-store";
import { CalendarEvent, StayPlanInput } from "@/types";
import { buildStayCheckpoints, daysBetween, getCheckpointStatus, getCheckpointStatusLabel, getTodayString } from "@/lib/stay-utils";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface StaySettlementCommandCenterProps {
  input: StayPlanInput;
}

interface SettlementAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: string;
  checklistId?: string;
}

const requiredChecklistIds = ["checklist_001", "checklist_002", "checklist_004", "checklist_005", "checklist_006", "checklist_010"];

function getDayInKorea(entryDate: string): number {
  return Math.max(0, daysBetween(entryDate || getTodayString(), getTodayString()));
}

function makeCalendarEvent(checkpoint: ReturnType<typeof buildStayCheckpoints>[number]): CalendarEvent {
  return {
    id: `calendar_${checkpoint.id}`,
    title: checkpoint.title,
    date: checkpoint.dueDate,
    category: "stay",
    note: checkpoint.description,
    sourceHref: checkpoint.href,
  };
}

function buildSettlementActions(input: StayPlanInput, completedChecklistIds: string[]): SettlementAction[] {
  const actions: SettlementAction[] = [];
  const isDone = (id: string) => completedChecklistIds.includes(id);

  if (!isDone("checklist_001")) {
    actions.push({
      id: "registration",
      title: "Confirm your ARC / residence registration path",
      description: "This is usually the highest-risk long-stay step. Check documents and appointment timing early.",
      href: "/stay?tab=checklist&category=registration",
      icon: Landmark,
      tone: "border-rose-100 bg-rose-50 text-rose-700",
      checklistId: "checklist_001",
    });
  }

  if (input.housingStatus !== "secured" || !isDone("checklist_006")) {
    actions.push({
      id: "housing",
      title: "Prepare address proof before official tasks",
      description: "Housing proof blocks registration, banking, insurance, delivery, and many resident services.",
      href: "/stay?tab=checklist&category=housing",
      icon: FileText,
      tone: "border-amber-100 bg-amber-50 text-amber-700",
      checklistId: "checklist_006",
    });
  }

  if (!isDone("checklist_002")) {
    actions.push({
      id: "phone",
      title: "Unblock your Korean phone number",
      description: "A local number makes banking, delivery, hospital visits, and Korean app verification much easier.",
      href: "/stay?tab=checklist&category=telecom",
      icon: CheckCircle2,
      tone: "border-sky-100 bg-sky-50 text-sky-700",
      checklistId: "checklist_002",
    });
  }

  if (!isDone("checklist_004")) {
    actions.push({
      id: "banking",
      title: "Start bank account preparation",
      description: input.hasEmployer
        ? "Prepare salary, payroll, and contract documents before visiting a bank."
        : "Check whether your school, sponsor, or residence status affects account opening.",
      href: "/stay?tab=checklist&category=banking",
      icon: Landmark,
      tone: "border-violet-100 bg-violet-50 text-violet-700",
      checklistId: "checklist_004",
    });
  }

  if (!isDone("checklist_005")) {
    actions.push({
      id: "healthcare",
      title: "Know your insurance and clinic route",
      description: "Decide how you will pay for care and where to go before you actually feel sick.",
      href: "/stay?tab=checklist&category=healthcare",
      icon: ShieldCheck,
      tone: "border-emerald-100 bg-emerald-50 text-emerald-700",
      checklistId: "checklist_005",
    });
  }

  if (!isDone("checklist_010")) {
    actions.push({
      id: "support",
      title: "Save official resident support contacts",
      description: "Keep immigration, NHIS, city support, and emergency routes nearby before a stressful moment.",
      href: "/stay?tab=guides",
      icon: ShieldCheck,
      tone: "border-gray-100 bg-gray-50 text-gray-700",
      checklistId: "checklist_010",
    });
  }

  return actions.slice(0, 3);
}

export function StaySettlementCommandCenter({ input }: StaySettlementCommandCenterProps) {
  const { user, calendarEvents, addCalendarEvent, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();
  const today = getTodayString();
  const checkpoints = buildStayCheckpoints(input);
  const dayInKorea = getDayInKorea(input.entryDate);
  const nextCheckpoint = checkpoints.find((checkpoint) => daysBetween(today, checkpoint.dueDate) >= 0) ?? checkpoints[checkpoints.length - 1];
  const nextStatus = getCheckpointStatus(nextCheckpoint.dueDate);
  const nextDaysLeft = daysBetween(today, nextCheckpoint.dueDate);
  const completedRequired = requiredChecklistIds.filter((id) => user.completedChecklistIds.includes(id)).length;
  const readinessScore = Math.round((completedRequired / requiredChecklistIds.length) * 100);
  const settlementActions = buildSettlementActions(input, user.completedChecklistIds);
  const calendarIds = new Set(calendarEvents.map((event) => event.id));
  const syncedCheckpoints = checkpoints.filter((checkpoint) => calendarIds.has(`calendar_${checkpoint.id}`)).length;

  const addAllCheckpoints = () => {
    const missingCheckpoints = checkpoints.filter((checkpoint) => !calendarIds.has(`calendar_${checkpoint.id}`));
    missingCheckpoints.forEach((checkpoint) => addCalendarEvent(makeCalendarEvent(checkpoint)));

    if (missingCheckpoints.length > 0) {
      showSnackbar(lt("{count} stay checkpoints added to Calendar", { count: String(missingCheckpoints.length) }), "success");
    } else {
      showSnackbar(lt("90-day checkpoints already in Calendar"), "default");
    }
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
            <ShieldCheck size={13} />
            {lt("Settlement command center")}
          </div>
          <h2 className="mt-3 text-lg font-bold text-gray-950">{lt("Your long-stay setup, ordered by what can block you next")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {lt("Use this view to connect entry date, official deadlines, checklist progress, documents, and Calendar reminders.")}
          </p>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-emerald-100">
          <p className="text-[11px] font-medium text-emerald-700">{lt("Day in Korea")}</p>
          <p className="text-xl font-bold text-gray-950">D+{dayInKorea}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className={cn("rounded-2xl border p-2", nextStatus === "overdue" ? "border-rose-200 bg-rose-50 text-rose-700" : nextStatus === "due-soon" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
              {nextStatus === "overdue" ? <AlertTriangle size={18} /> : <Clock3 size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">D+{nextCheckpoint.offsetDays}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{lt(getCheckpointStatusLabel(nextStatus))}</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">{nextCheckpoint.dueDate}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">{lt(nextCheckpoint.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(nextCheckpoint.description)}</p>
              <p className="mt-2 text-[11px] font-medium text-gray-500">
                {nextDaysLeft < 0
                  ? lt("{days} days late", { days: String(Math.abs(nextDaysLeft)) })
                  : nextDaysLeft === 0
                  ? lt("Due today")
                  : lt("{days} days left", { days: String(nextDaysLeft) })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={nextCheckpoint.href} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm">
              {lt("Open next official step")}
            </Link>
            <button type="button" onClick={addAllCheckpoints} className="inline-flex items-center gap-1 rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-sm">
              <CalendarPlus size={14} />
              {syncedCheckpoints > 0 ? lt("Sync missing checkpoints") : lt("Add 90-day timeline")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/stay?tab=checklist" className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{lt("Core readiness")}</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">{readinessScore}%</p>
            <p className="mt-1 text-xs text-gray-500">{completedRequired}/{requiredChecklistIds.length} {lt("core tasks")}</p>
          </Link>
          <Link href="/calendar" className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{lt("Calendar sync")}</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">{syncedCheckpoints}/{checkpoints.length}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("timeline checkpoints")}</p>
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{lt("Do these next")}</p>
        {settlementActions.map(({ id, title, description, href, icon: Icon, tone }) => (
          <Link key={id} href={href} className="block rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-transform active:scale-[0.99]">
            <div className="flex items-start gap-3">
              <div className={cn("rounded-xl border p-2", tone)}><Icon size={16} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{lt(title)}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(description)}</p>
              </div>
            </div>
          </Link>
        ))}
        {settlementActions.length === 0 ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-emerald-700 shadow-sm">
            {lt("Your core long-stay blockers look handled. Keep documents and renewal dates updated.")}
          </div>
        ) : null}
      </div>
    </section>
  );
}
