"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, FileText, Languages, Receipt, Sparkles } from "lucide-react";
import { arrival72Tasks } from "@/data/arrival-72-flow";
import { lifeChecklist } from "@/data/life-checklist";
import { stay90Missions } from "@/data/stay-90-missions";
import { officialStampGoals } from "@/data/stamp-catalog";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

interface NextAction {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: string;
}

function getRatio(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function getProgressWidthClass(value: number) {
  if (value >= 100) return "w-full";
  if (value >= 75) return "w-3/4";
  if (value >= 50) return "w-1/2";
  if (value >= 25) return "w-1/4";
  if (value > 0) return "w-1/6";
  return "w-0";
}

export function MyRetentionSnapshot() {
  const {
    user,
    receiptRecords,
    savedCareProviderIds,
    savedShopStoreIds,
    savedStayResourceIds,
    stayDocuments,
    calendarEvents,
    customStampGoals,
    completedArrival72TaskIds,
    completedStayMissionIds,
    completedStampGoalIds,
  } = useAppStore();
  const { lt } = useLocalizedText();

  const arrivalProgress = getRatio(completedArrival72TaskIds.length, arrival72Tasks.length);
  const lifeProgress = getRatio(user.completedChecklistIds.length, lifeChecklist.length);
  const stayProgress = getRatio(completedStayMissionIds.length, stay90Missions.length);
  const stampTotal = officialStampGoals.length + customStampGoals.length;
  const stampProgress = getRatio(completedStampGoalIds.length, stampTotal);
  const pendingReceipts = receiptRecords.filter((record) => record.refundStatus === "pending" || record.refundStatus === "needs-check").length;

  const nextActions: NextAction[] = [
    pendingReceipts > 0
      ? {
          id: "receipts",
          title: "Review pending receipts",
          description: "Finish passport checks and refund status before departure.",
          href: "/shop/receipts",
          tone: "bg-amber-50 text-amber-700 ring-amber-100",
        }
      : null,
    user.savedPhraseIds.length === 0
      ? {
          id: "phrases",
          title: "Save your first Korean phrase",
          description: "Keep one phrase ready for taxi, pharmacy, or emergency moments.",
          href: "/assistant",
          tone: "bg-violet-50 text-violet-700 ring-violet-100",
        }
      : null,
    user.mode === "life" && stayDocuments.length < 3
      ? {
          id: "documents",
          title: "Build your document vault",
          description: "Add passport, housing, insurance, school, or work document notes.",
          href: "/stay?tab=documents",
          tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        }
      : null,
    savedCareProviderIds.length === 0
      ? {
          id: "care",
          title: "Save a clinic or pharmacy",
          description: "Keep one nearby care option ready before you need it.",
          href: "/care?tab=providers",
          tone: "bg-rose-50 text-rose-700 ring-rose-100",
        }
      : null,
    calendarEvents.length === 0
      ? {
          id: "calendar",
          title: "Add one important date",
          description: "Track departure, appointment, or 90-day stay checkpoints.",
          href: "/calendar",
          tone: "bg-sky-50 text-sky-700 ring-sky-100",
        }
      : null,
  ].filter((item): item is NextAction => Boolean(item)).slice(0, 3);

  const progressItems = [
    { label: "Arrival 72h", value: arrivalProgress, done: completedArrival72TaskIds.length, total: arrival72Tasks.length },
    { label: "Life checklist", value: lifeProgress, done: user.completedChecklistIds.length, total: lifeChecklist.length },
    { label: "Stay missions", value: stayProgress, done: completedStayMissionIds.length, total: stay90Missions.length },
    { label: "Stamps", value: stampProgress, done: completedStampGoalIds.length, total: stampTotal },
  ];

  const savedTotal = user.savedPlaceIds.length + user.savedPhraseIds.length + savedShopStoreIds.length + savedCareProviderIds.length + savedStayResourceIds.length;

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
              <Sparkles size={13} />
              {lt("Landly command center")}
            </div>
            <p className="mt-3 text-base font-semibold text-gray-900">{lt("Pick up exactly where you left off")}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Saved places, phrases, receipts, care options, documents, and dates now live together in My.")}</p>
          </div>
          <CheckCircle2 className="mt-1 text-emerald-500" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500"><Languages size={13} /> {lt("Saved essentials")}</div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{savedTotal}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500"><Receipt size={13} /> {lt("Receipts")}</div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{receiptRecords.length}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500"><FileText size={13} /> {lt("Documents")}</div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stayDocuments.length}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500"><CalendarDays size={13} /> {lt("Calendar")}</div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{calendarEvents.length}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {progressItems.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{lt(item.label)}</span>
                <span className="text-gray-500">{item.done}/{item.total}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full bg-sky-500 ${getProgressWidthClass(item.value)}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-sm font-semibold text-gray-900">{lt("Recommended next")}</p>
          <div className="mt-3 space-y-2">
            {nextActions.length === 0 ? (
              <div className="rounded-2xl bg-white px-3 py-4 text-sm text-gray-500">{lt("Your essentials are well organized. Review reminders or add a new stamp goal next.")}</div>
            ) : (
              nextActions.map((action) => (
                <Link key={action.id} href={action.href} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-3 transition-colors hover:bg-gray-100">
                  <div>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${action.tone}`}>{lt("Next action")}</span>
                    <p className="mt-2 text-sm font-semibold text-gray-900">{lt(action.title)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{lt(action.description)}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-gray-400" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
