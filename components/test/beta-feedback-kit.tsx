"use client";

import { ClipboardCheck, ExternalLink, MessageSquarePlus } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "mailto:hwani.project@gmail.com?subject=Landly%20Feedback";

const feedbackTemplate = `Landly beta feedback\n\n1. Tester profile\n- Country / language:\n- Tourist, student, worker, or resident:\n- Device:\n\n2. Mission tested\n- Arrival / Shop / Care / Stay / Assistant / My:\n\n3. What worked well\n- \n\n4. What was confusing\n- \n\n5. What should be improved first\n- \n\n6. Would you use Landly again? Why?\n- `;

export function BetaFeedbackKit() {
  const { lt } = useLocalizedText();
  const showSnackbar = useAppStore((state) => state.showSnackbar);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedbackTemplate);
      showSnackbar("Feedback template copied.", "success");
    } catch {
      showSnackbar("Copy failed. Please use the feedback button instead.", "warning");
    }
  };

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
          <MessageSquarePlus size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Feedback kit")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Ask testers to complete one mission, then capture what felt useful, confusing, or missing.")}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={handleCopy} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-xs font-semibold text-gray-700 active:scale-[0.99]">
          <ClipboardCheck size={15} />
          {lt("Copy template")}
        </button>
        <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-3 text-xs font-semibold text-white active:scale-[0.99]">
          {lt("Open form")}
          <ExternalLink size={14} className="opacity-70" />
        </a>
      </div>
    </section>
  );
}
