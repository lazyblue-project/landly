"use client";

import { ChangeEvent, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileJson, ShieldCheck, Upload } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const RESTORABLE_KEYS = [
  "user",
  "savedPassPlans",
  "savedShopStoreIds",
  "receiptRecords",
  "savedCareProviderIds",
  "visitPrepNotes",
  "stayPlanInput",
  "stayDocuments",
  "savedStayResourceIds",
  "calendarEvents",
  "customStampGoals",
  "completedStampGoalIds",
  "interestedPromotionIds",
  "savedPromotionIds",
  "bookedPromotionIds",
  "savedPartnerOfferIds",
  "requestedPartnerOfferIds",
  "acknowledgedPartnerDisclosureIds",
  "departureDate",
  "companions",
  "completedArrival72TaskIds",
  "completedStayMissionIds",
  "completedBetaMissionIds",
  "betaFeedbackRecords",
  "translationFeedbackRecords",
  "userFeedbackRecords",
  "completedPilotQaCheckIds",
  "manualReminderItems",
  "completedReminderIds",
  "isBetaTester",
] as const;

function buildExportFileName() {
  const date = new Date().toISOString().slice(0, 10);
  return `landly-export-${date}.json`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractRestorableSnapshot(payload: unknown) {
  if (!isObject(payload)) return null;

  const source = isObject(payload.state) ? payload.state : payload;
  const snapshot: Record<string, unknown> = {};

  RESTORABLE_KEYS.forEach((key) => {
    if (source[key] !== undefined) {
      snapshot[key] = source[key];
    }
  });

  return Object.keys(snapshot).length > 0 ? snapshot : null;
}

export function DataExportCard() {
  const { lt } = useLocalizedText();
  const state = useAppStore();
  const importBackupSnapshot = useAppStore((store) => store.importBackupSnapshot);
  const showSnackbar = useAppStore((store) => store.showSnackbar);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      version: "v51",
      schema: "landly-local-backup",
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
      acknowledgedPartnerDisclosureIds: state.acknowledgedPartnerDisclosureIds,
      departureDate: state.departureDate,
      companions: state.companions,
      completedArrival72TaskIds: state.completedArrival72TaskIds,
      completedStayMissionIds: state.completedStayMissionIds,
      completedBetaMissionIds: state.completedBetaMissionIds,
      betaFeedbackRecords: state.betaFeedbackRecords,
      translationFeedbackRecords: state.translationFeedbackRecords,
      userFeedbackRecords: state.userFeedbackRecords,
      completedPilotQaCheckIds: state.completedPilotQaCheckIds,
      manualReminderItems: state.manualReminderItems,
      completedReminderIds: state.completedReminderIds,
      isBetaTester: state.isBetaTester,
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
    showSnackbar(lt("JSON backup downloaded"), "success");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    setImportError(null);

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as unknown;
      const snapshot = extractRestorableSnapshot(payload);

      if (!snapshot) {
        throw new Error("No restorable Landly fields were found in this file.");
      }

      const confirmed = window.confirm(
        lt("Importing a backup will replace matching saved Landly data on this device. Continue?")
      );

      if (!confirmed) return;

      const appliedKeys = importBackupSnapshot(snapshot);
      const message = `${lt("Backup imported")} · ${appliedKeys.length} ${lt("sections restored")}`;
      setImportStatus(message);
      showSnackbar(message, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to import this backup file.";
      setImportError(message);
      showSnackbar(lt("Backup import failed"), "warning");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
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
              <span>{lt("Export and import stay on your device. No server upload is used in this MVP build.")}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white active:scale-[0.99]"
          >
            <Download size={16} />
            {lt("Download JSON backup")}
          </button>
          <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-700 active:scale-[0.99]">
            <Upload size={16} />
            {lt("Import JSON backup")}
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="sr-only"
            />
          </label>
        </div>

        {importStatus ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
            <span>{importStatus}</span>
          </div>
        ) : null}

        {importError ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700 ring-1 ring-amber-100">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>{lt(importError)}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
