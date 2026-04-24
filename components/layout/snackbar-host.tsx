"use client";

import { useEffect } from "react";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const toneStyles = {
  default: "border-gray-200 bg-white text-gray-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
} as const;

const toneIcons = {
  default: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
} as const;

export function SnackbarHost() {
  const snackbar = useAppStore((state) => state.snackbar);
  const hideSnackbar = useAppStore((state) => state.hideSnackbar);

  useEffect(() => {
    if (!snackbar) return;
    const timer = window.setTimeout(() => hideSnackbar(), 2200);
    return () => window.clearTimeout(timer);
  }, [snackbar, hideSnackbar]);

  if (!snackbar) return null;

  const Icon = toneIcons[snackbar.tone];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] mx-auto flex max-w-md justify-center px-4">
      <div
        className={cn(
          "pointer-events-auto inline-flex min-w-[220px] items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg transition-all",
          toneStyles[snackbar.tone]
        )}
        role="status"
        aria-live="polite"
      >
        <Icon size={16} className="shrink-0" />
        <span>{snackbar.message}</span>
      </div>
    </div>
  );
}
