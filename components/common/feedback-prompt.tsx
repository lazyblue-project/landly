"use client";

import { ExternalLink, MessageSquarePlus } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "mailto:hwani.project@gmail.com?subject=Landly%20Feedback";

interface FeedbackPromptProps {
  context?: string;
  compact?: boolean;
}

export function FeedbackPrompt({ context = "Landly", compact = false }: FeedbackPromptProps) {
  const { lt } = useLocalizedText();
  const href = FEEDBACK_URL.includes("mailto:")
    ? `${FEEDBACK_URL}&body=${encodeURIComponent(`Feedback context: ${context}\n\n`)}`
    : FEEDBACK_URL;

  return (
    <section className="px-4 py-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
            <MessageSquarePlus size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt("Was this helpful?")}</p>
            {!compact ? (
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {lt("Tell us what felt confusing, missing, or useful so Landly can improve before public launch.")}
              </p>
            ) : null}
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]"
        >
          {lt("Send feedback")}
          <ExternalLink size={14} className="opacity-70" />
        </a>
      </div>
    </section>
  );
}
