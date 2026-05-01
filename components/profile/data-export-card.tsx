"use client";

import { Download, FileJson, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

function buildExportFileName() {
  const date = new Date().toISOString().slice(0, 10);
  return `landly-export-${date}.json`;
}

export function DataExportCard() {
  const { lt } = useLocalizedText();
  const state = useAppStore();

  const handleExport = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      version: "v46",
      user: state.user,
      savedPassPlans: state.savedPassPlans,
      savedShopStoreIds: state.savedShopStoreIds,
      receiptRecords: state.receiptRecords,
      savedCareProviderIds: state.savedCareProviderIds,
      visitPrepNotes: state.visitPrepNotes,
      stayPlanInput: state.stayPlanInput,
      stayDocuments: state.stayDocuments,
      savedStayResourceIds: state.savedStayResourceIds,
      calendarEvents: state.calendarEvents,
      customStampGoals: state.customStampGoals,
      completedStampGoalIds: state.completedStampGoalIds,
      interestedPromotionIds: state.interestedPromotionIds,
      savedPromotionIds: state.savedPromotionIds,
      bookedPromotionIds: state.bookedPromotionIds,
      savedPartnerOfferIds: state.savedPartnerOfferIds,
      requestedPartnerOfferIds: state.requestedPartnerOfferIds,
      departureDate: state.departureDate,
      companions: state.companions,
      completedArrival72TaskIds: state.completedArrival72TaskIds,
      completedStayMissionIds: state.completedStayMissionIds,
      manualReminderItems: state.manualReminderItems,
      completedReminderIds: state.completedReminderIds,
      translationFeedbackRecords: state.translationFeedbackRecords,
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildExportFileName();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-2 text-sky-700 ring-1 ring-sky-100">
            <FileJson size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-950">{lt("Backup your Landly data")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {lt("Export saved places, phrases, receipts, care notes, documents, reminders, and plans as a JSON file before clearing browser data or changing devices.")}
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-[11px] leading-relaxed text-sky-700 ring-1 ring-sky-100">
              <ShieldCheck size={14} className="shrink-0" />
              <span>{lt("Export stays on your device. No server upload is used in this MVP build.")}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99]"
        >
          <Download size={16} />
          {lt("Download JSON backup")}
        </button>
      </div>
    </section>
  );
}
