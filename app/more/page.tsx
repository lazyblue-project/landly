"use client";

import Link from "next/link";
import { FlaskConical, MessageSquarePlus, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { moreMenuSections } from "@/data/more-menu";
import { useLocalizedText } from "@/lib/text-localizer";

const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "mailto:hwani.project@gmail.com?subject=Landly%20Feedback";

export default function MorePage() {
  const { lt } = useLocalizedText();

  return (
    <AppShell>
      <TopBar title={lt("More")} />
      <div className="space-y-5 px-4 py-4">
        {moreMenuSections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-gray-900">{lt(section.title)}</p>
              <p className="mt-1 text-xs text-gray-500">{lt(section.description)}</p>
            </div>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
                    <div className="rounded-2xl bg-white p-2 text-sky-600 shadow-sm"><Icon size={18} /></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{lt(item.label)}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{lt(item.description)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* Tester section */}
        <section className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-violet-900">Beta Tester</p>
          <p className="mt-1 text-xs text-violet-600">테스트 시나리오를 빠르게 체험하거나 피드백을 남겨주세요.</p>
          <div className="mt-4 space-y-3">
            <Link href="/test" className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 transition-colors hover:bg-violet-50">
              <div className="rounded-2xl bg-violet-100 p-2 text-violet-600 shadow-sm"><FlaskConical size={18} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Quick Test Guide</p>
                <p className="mt-0.5 text-xs text-gray-500">주요 기능 테스트 시나리오 바로가기</p>
              </div>
            </Link>
            <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 transition-colors hover:bg-violet-50">
              <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-600 shadow-sm"><MessageSquarePlus size={18} /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Send Feedback</p>
                <p className="mt-0.5 text-xs text-gray-500">버그 · UX · 번역 피드백 제출</p>
              </div>
              <ExternalLink size={14} className="text-gray-400" />
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
