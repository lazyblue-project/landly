import { useMemo } from "react";
import { ReminderItem, ReminderStatus } from "@/types";
import { useAppStore } from "@/store/app-store";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getStatus(dueDate?: string, done = false): ReminderStatus {
  if (done) return "done";
  const due = parseDate(dueDate);
  if (!due) return "upcoming";
  const today = startOfToday();
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "overdue";
  if (diff <= 7) return "due-soon";
  return "upcoming";
}

export function useReminderEngine() {
  const {
    manualReminderItems,
    completedReminderIds,
    stayDocuments,
    savedPassPlans,
    calendarEvents,
    stayPlanInput,
  } = useAppStore();

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

    if (stayPlanInput?.entryDate) {
      const entry = parseDate(stayPlanInput.entryDate);
      if (entry) {
        derived.push({
          id: "checkpoint_30",
          title: "30-day Korea setup review",
          dueDate: formatDate(addDays(entry, 30)),
          source: "stay-checkpoint",
          description: "Review telecom, banking, healthcare, and saved documents.",
          href: "/stay?tab=first90",
        });
        derived.push({
          id: "checkpoint_90",
          title: "90-day Korea setup review",
          dueDate: formatDate(addDays(entry, 90)),
          source: "stay-checkpoint",
          description: "Double-check official registration, tax, labor, or school-related basics.",
          href: "/stay?tab=first90",
        });
      }
    }

    const manual = manualReminderItems.map((item) => ({ ...item }));
    const allItems = [...manual, ...derived].sort((a, b) => (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31"));

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
  }, [manualReminderItems, completedReminderIds, stayDocuments, savedPassPlans, calendarEvents, stayPlanInput]);
}
