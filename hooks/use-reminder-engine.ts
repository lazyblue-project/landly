import { useMemo } from "react";
import type { ReminderItem, ReminderStatus } from "@/types";
import { useAppStore } from "@/store/app-store";

const DAY_MS = 1000 * 60 * 60 * 24;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseLocalDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addDays(base: Date, days: number) {
  const next = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStatus(dueDate?: string, done = false): ReminderStatus {
  if (done) return "done";
  const due = parseLocalDate(dueDate);
  if (!due) return "upcoming";
  const today = startOfToday();
  const diff = Math.floor((due.getTime() - today.getTime()) / DAY_MS);
  if (diff < 0) return "overdue";
  if (diff <= 7) return "due-soon";
  return "upcoming";
}

export function useReminderEngine() {
  const manualReminderItems = useAppStore((state) => state.manualReminderItems);
  const completedReminderIds = useAppStore((state) => state.completedReminderIds);
  const stayDocuments = useAppStore((state) => state.stayDocuments);
  const savedPassPlans = useAppStore((state) => state.savedPassPlans);
  const calendarEvents = useAppStore((state) => state.calendarEvents);
  const stayPlanInput = useAppStore((state) => state.stayPlanInput);
  const receiptRecords = useAppStore((state) => state.receiptRecords);
  const departureDate = useAppStore((state) => state.departureDate);

  return useMemo(() => {
    const derived: ReminderItem[] = [];

    stayDocuments.forEach((document) => {
      if (!document.expiryDate) return;
      derived.push({
        id: `document_${document.id}`,
        title: `Check ${document.title}`,
        dueDate: document.expiryDate,
        source: "document",
        description: document.note ?? `Expiry date saved for ${document.title}.`,
        href: "/stay?tab=documents",
      });
    });

    savedPassPlans.forEach((plan) => {
      if (!plan.input.arrivalDate) return;
      derived.push({
        id: `arrival_${plan.id}`,
        title: `Arrival plan: ${plan.name}`,
        dueDate: plan.input.arrivalDate,
        source: "arrival-plan",
        description: `Reopen ${plan.input.destinationArea} and your selected route before travel day.`,
        href: "/pass?tab=saved",
      });
    });

    calendarEvents.forEach((event) => {
      derived.push({
        id: `calendar_${event.id}`,
        title: event.title,
        dueDate: event.date,
        source: "calendar",
        description: event.location ?? event.note,
        href: event.sourceHref ?? "/calendar",
      });
    });

    if (departureDate) {
      derived.push({
        id: "departure_review",
        title: "Departure day review",
        dueDate: departureDate,
        source: "departure",
        description: "Check airport route, tax refund receipts, saved phrases, and final Korea tasks before leaving.",
        href: "/shop/receipts",
      });
    }

    receiptRecords.forEach((receipt) => {
      if (receipt.refundStatus !== "pending" && receipt.refundStatus !== "needs-check") return;
      const storeLabel = receipt.storeName ?? "Tax refund receipt";
      derived.push({
        id: `receipt_${receipt.id}`,
        title: `Review ${storeLabel}`,
        dueDate: departureDate,
        source: "shop-refund",
        description: receipt.passportReady
          ? "Receipt is saved. Re-check refund status before airport or store refund steps."
          : "Passport check is not marked ready yet. Confirm before departure or checkout.",
        href: "/shop/receipts",
      });
    });

    if (stayPlanInput?.entryDate) {
      const entry = parseLocalDate(stayPlanInput.entryDate);
      if (entry) {
        derived.push({
          id: "checkpoint_30",
          title: "30-day Korea setup review",
          dueDate: formatLocalDate(addDays(entry, 30)),
          source: "stay-checkpoint",
          description: "Review telecom, banking, healthcare, and saved documents.",
          href: "/stay?tab=first90",
        });
        derived.push({
          id: "checkpoint_90",
          title: "90-day Korea setup review",
          dueDate: formatLocalDate(addDays(entry, 90)),
          source: "stay-checkpoint",
          description: "Double-check official registration, tax, labor, or school-related basics.",
          href: "/stay?tab=first90",
        });
      }
    }

    const manual = manualReminderItems.map((item) => ({ ...item }));
    const allItems = [...manual, ...derived].sort((a, b) =>
      (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31")
    );

    const decorated = allItems.map((item) => ({
      ...item,
      status: getStatus(item.dueDate, completedReminderIds.includes(item.id)),
    }));

    return {
      allItems: decorated,
      summary: {
        total: decorated.length,
        dueSoon: decorated.filter((item) => item.status === "due-soon").length,
        overdue: decorated.filter((item) => item.status === "overdue").length,
        done: decorated.filter((item) => item.status === "done").length,
      },
    };
  }, [
    manualReminderItems,
    completedReminderIds,
    stayDocuments,
    savedPassPlans,
    calendarEvents,
    stayPlanInput,
    receiptRecords,
    departureDate,
  ]);
}
