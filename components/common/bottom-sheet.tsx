"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ open, title, description, onClose, children, className }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      <div
        className={cn(
          "w-full max-w-md rounded-t-3xl border border-gray-200 bg-white p-4 shadow-2xl sm:rounded-3xl",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-gray-900">{title}</p>
            {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
