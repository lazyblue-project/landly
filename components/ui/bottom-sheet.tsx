"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, description, children, className }: BottomSheetProps) {
  const { lt } = useLocalizedText();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] bg-black/40 px-4 pb-4 pt-10" onClick={onClose}>
      <div
        className={cn("mx-auto mt-auto max-w-md rounded-[28px] bg-white p-5 shadow-2xl", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
        <div className="flex items-start justify-between gap-4">
          <div>
            {title ? <p className="text-base font-semibold text-gray-900">{lt(title)}</p> : null}
            {description ? <p className="mt-1 text-sm leading-relaxed text-gray-500">{lt(description)}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200"
            aria-label={lt("Close")}
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
