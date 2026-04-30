"use client";

import { useEffect, useId } from "react";
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
  const titleId = useId();
  const descriptionId = useId();

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
    <div className="fixed inset-0 z-[65] flex items-end bg-black/40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "mx-auto max-h-[calc(100dvh-2.5rem)] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
        <div className="flex items-start justify-between gap-4">
          <div>
            {title ? <p id={titleId} className="text-base font-semibold text-gray-900">{lt(title)}</p> : null}
            {description ? <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-gray-500">{lt(description)}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-xl bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200"
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
