"use client";

import { CheckCircle2 } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

interface SnackbarProps {
  message: string | null;
}

export function Snackbar({ message }: SnackbarProps) {
  const { lt } = useLocalizedText();
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] mx-auto flex w-full max-w-md justify-center px-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
        <CheckCircle2 size={16} className="text-emerald-400" />
        <span>{lt(message)}</span>
      </div>
    </div>
  );
}
