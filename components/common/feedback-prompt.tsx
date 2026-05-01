"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, ExternalLink, MessageSquarePlus, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import type { UserFeedbackCategory, UserFeedbackRecord } from "@/types";
import { isFeedbackApiEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "mailto:hwani.project@gmail.com?subject=Landly%20Feedback";

interface FeedbackPromptProps {
  context?: string;
  compact?: boolean;
}

const categoryOptions: { id: UserFeedbackCategory; label: string }[] = [
  { id: "useful", label: "Useful" },
  { id: "confusing", label: "Confusing" },
  { id: "missing", label: "Missing" },
  { id: "bug", label: "Bug" },
  { id: "idea", label: "Idea" },
];

const ratingOptions: UserFeedbackRecord["rating"][] = [1, 2, 3, 4, 5];

export function FeedbackPrompt({ context = "Landly", compact = false }: FeedbackPromptProps) {
  const { lt } = useLocalizedText();
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const addUserFeedbackRecord = useAppStore((state) => state.addUserFeedbackRecord);
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const [expanded, setExpanded] = useState(!compact);
  const [category, setCategory] = useState<UserFeedbackCategory>("confusing");
  const [rating, setRating] = useState<UserFeedbackRecord["rating"]>(4);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "failed">("idle");

  const href = FEEDBACK_URL.includes("mailto:")
    ? `${FEEDBACK_URL}&body=${encodeURIComponent(`Feedback context: ${context}\nPath: ${pathname ?? "unknown"}\n\n`)}`
    : FEEDBACK_URL;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;

    const record: UserFeedbackRecord = {
      id: `user_feedback_${Date.now()}`,
      context,
      category,
      rating,
      note: trimmed,
      path: pathname ?? undefined,
      language: user.language,
      mode: user.mode,
      submittedToApi: false,
      createdAt: new Date().toISOString(),
    };

    let submittedToApi = false;
    if (isFeedbackApiEnabled()) {
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
        submittedToApi = response.ok;
      } catch {
        submittedToApi = false;
      }
    }

    addUserFeedbackRecord({ ...record, submittedToApi });
    setNote("");
    setStatus("saved");
    showSnackbar(lt("Feedback saved on this device"), "success");
  };

  return (
    <section className="px-4 py-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
            <MessageSquarePlus size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt("Was this helpful?")}</p>
            {!compact || expanded ? (
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {lt("Tell us what felt confusing, missing, or useful so Landly can improve before public launch.")}
              </p>
            ) : null}
          </div>
        </div>

        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]"
          >
            {lt("Send feedback")}
            <MessageSquarePlus size={14} className="opacity-70" />
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700">{lt("Feedback type")}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setCategory(option.id)}
                    className={cn(
                      "rounded-2xl border px-3 py-2 text-xs font-semibold active:scale-[0.99]",
                      category === option.id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    )}
                  >
                    {lt(option.label)}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-semibold text-gray-700">{lt("Clarity score")}</span>
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value) as UserFeedbackRecord["rating"])}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-400"
              >
                {ratingOptions.map((value) => (
                  <option key={value} value={value}>{value}/5</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-gray-700">{lt("Feedback note")}</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                maxLength={1200}
                placeholder={lt("Example: I could not find the next step after opening this page.")}
                className="mt-1 w-full resize-none rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-400"
              />
              <span className="mt-1 block text-right text-[11px] text-gray-400">{note.length}/1200</span>
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="submit"
                disabled={!note.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 active:scale-[0.99]"
              >
                <Send size={15} />
                {lt("Save feedback")}
              </button>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 active:scale-[0.99]"
              >
                {lt("Open external form")}
                <ExternalLink size={14} className="opacity-70" />
              </a>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
              {status === "saved" ? (
                <span className="inline-flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={14} />
                  {lt("Feedback saved on this device")}
                </span>
              ) : (
                lt(isFeedbackApiEnabled() ? "Feedback is saved locally and optionally sent to the configured feedback API." : "Feedback is saved locally. Use the external form when you want to send it to the team.")
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
