"use client";

import Link from "next/link";
import { ClipboardCheck, FileText, Landmark, Target } from "lucide-react";
import { lifeChecklist } from "@/data/life-checklist";
import { useAppStore } from "@/store/app-store";
import { StayPlanInput } from "@/types";
import { buildStayCheckpoints, daysBetween, getTodayString } from "@/lib/stay-utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface StayProgressSnapshotProps {
  input: StayPlanInput;
}

export function StayProgressSnapshot({ input }: StayProgressSnapshotProps) {
  const { user, stayDocuments, savedStayResourceIds } = useAppStore();
  const { lt } = useLocalizedText();
  const totalChecklist = lifeChecklist.length;
  const completedChecklist = user.completedChecklistIds.length;
  const checklistRatio = Math.round((completedChecklist / Math.max(totalChecklist, 1)) * 100);
  const checkpoints = buildStayCheckpoints(input);
  const overdueCount = checkpoints.filter((item) => daysBetween(getTodayString(), item.dueDate) < 0).length;
  const dueSoonCount = checkpoints.filter((item) => {
    const daysLeft = daysBetween(getTodayString(), item.dueDate);
    return daysLeft >= 0 && daysLeft <= 14;
  }).length;

  const cards = [
    {
      title: "Checklist progress",
      value: `${completedChecklist}/${totalChecklist}`,
      caption: `${checklistRatio}%`,
      href: "/stay?tab=checklist",
      icon: ClipboardCheck,
    },
    {
      title: "Upcoming checkpoints",
      value: String(dueSoonCount),
      caption: overdueCount > 0 ? `${overdueCount} overdue` : "Next 14 days",
      href: "/stay?tab=first90",
      icon: Target,
    },
    {
      title: "Document notes",
      value: String(stayDocuments.length),
      caption: "Vault items",
      href: "/stay?tab=documents",
      icon: FileText,
    },
    {
      title: "Saved official routes",
      value: String(savedStayResourceIds.length),
      caption: "Bookmarked",
      href: "/stay?tab=guides",
      icon: Landmark,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {cards.map(({ title, value, caption, href, icon: Icon }) => (
        <Link key={title} href={href} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <Icon size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">{value}</span>
          </div>
          <p className="mt-3 text-xs font-semibold text-gray-900">{lt(title)}</p>
          <p className="mt-1 text-[11px] text-gray-500">{lt(caption)}</p>
        </Link>
      ))}
    </section>
  );
}
