"use client";

import { ReactNode, useEffect, useId } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface BottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ open, title, description, onClose, children, className }: BottomSheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { lt } = useLocalizedText();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-t-3xl border border-gray-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p id={titleId} className="text-base font-semibold text-gray-900">{lt(title)}</p>
            {description ? <p id={descriptionId} className="mt-1 text-sm text-gray-500">{lt(description)}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
            aria-label={lt("Close")}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
