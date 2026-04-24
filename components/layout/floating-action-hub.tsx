"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, Cross, MessageSquareText, Sparkles, X } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useAppStore } from "@/store/app-store";
import { triggerHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

export function FloatingActionHub() {
  const router = useRouter();
  const pathname = usePathname();
  const mode = useAppStore((state) => state.user.mode);
  const { lt } = useLocalizedText();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/onboarding")) return null;

  const speedDialActions = [
    { label: "SOS", icon: AlertTriangle, className: "bg-amber-500 text-white", onClick: () => router.push("/sos") },
    { label: "Phrases", icon: MessageSquareText, className: "bg-blue-600 text-white", onClick: () => router.push("/assistant?category=emergency") },
    { label: mode === "travel" ? "Pass" : "Stay", icon: mode === "travel" ? Sparkles : Cross, className: mode === "travel" ? "bg-sky-600 text-white" : "bg-emerald-600 text-white", onClick: () => router.push(mode === "travel" ? "/pass?tab=launchers" : "/stay?tab=plan") },
  ];

  return (
    <>
      <div className="fixed bottom-20 left-0 right-0 z-[60] mx-auto flex max-w-md justify-end px-4">
        <div className="flex flex-col items-end gap-2">
          {open ? (
            <div className="mb-1 flex flex-col items-end gap-2">
              {speedDialActions.map(({ label, icon: Icon, className, onClick }) => (
                <button key={label} type="button" onClick={() => { triggerHaptic("light"); setOpen(false); onClick(); }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg">
                  <span>{lt(label)}</span>
                  <span className={cn("rounded-xl p-2", className)}><Icon size={16} /></span>
                </button>
              ))}
              <button type="button" onClick={() => { triggerHaptic("light"); setOpen(false); setSupportOpen(true); }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg">
                <span>{lt("Tourist hotline")}</span>
                <span className="rounded-xl bg-gray-900 p-2 text-white"><Cross size={16} /></span>
              </button>
            </div>
          ) : null}

          <button type="button" onClick={() => { triggerHaptic("medium"); setOpen((prev) => !prev); }} className={cn("inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all active:scale-[0.97]", compact && "px-3")} aria-label={lt("Open a service")}>
            {open ? <X size={18} /> : <Sparkles size={18} />}
            {!compact ? <span>{lt(open ? "Close" : "Landly Now")}</span> : null}
          </button>
        </div>
      </div>

      <BottomSheet open={supportOpen} onClose={() => setSupportOpen(false)} title="Quick support" description="Fast actions for emergency numbers and help flows without losing your current screen.">
        <div className="space-y-2">
          <a href="tel:112" className="flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800">{lt("Police 112")}<AlertTriangle size={16} className="text-blue-600" /></a>
          <a href="tel:119" className="flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800">{lt("Ambulance / Fire 119")}<Cross size={16} className="text-red-600" /></a>
          <a href="tel:1330" className="flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800">{lt("Tourist hotline 1330")}<MessageSquareText size={16} className="text-amber-600" /></a>
        </div>
      </BottomSheet>
    </>
  );
}
