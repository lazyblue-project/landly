"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, showBack = false, right, className }: TopBarProps) {
  const router = useRouter();
  const { lt } = useLocalizedText();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-gray-100 bg-white/90 px-4 h-14 flex items-center justify-between backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/90",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="-ml-1 p-1 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            aria-label={lt("Back")}
          >
            <ArrowLeft size={22} />
          </button>
        )}
        {title && <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-50">{lt(title)}</h1>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}
