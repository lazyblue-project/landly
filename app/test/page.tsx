"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import {
  Plane,
  HeartPulse,
  ShieldAlert,
  LifeBuoy,
  CalendarDays,
  Languages,
  MessageSquarePlus,
  ExternalLink,
} from "lucide-react";

const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "mailto:hwani.project@gmail.com?subject=Landly%20Feedback";

const scenarios = [
  {
    id: "arrival",
    label: "Arrival Test",
    description: "공항 도착 → 경로 저장 → 72h 플로우 확인",
    href: "/pass",
    icon: Plane,
    color: "sky",
  },
  {
    id: "care",
    label: "Care Test",
    description: "증상 선택 → 병원/약국/의료 지원 확인",
    href: "/care",
    icon: HeartPulse,
    color: "rose",
  },
  {
    id: "sos",
    label: "SOS Test",
    description: "긴급 시나리오 확인 → 필요한 표현/연결 경로 확인",
    href: "/sos",
    icon: ShieldAlert,
    color: "amber",
  },
  {
    id: "stay",
    label: "Stay Test",
    description: "First 90d 체크 → 문서/리마인더 확인",
    href: "/life?tab=first90",
    icon: LifeBuoy,
    color: "emerald",
  },
  {
    id: "calendar",
    label: "Calendar Test",
    description: "일정 저장 → 달력 뷰 확인",
    href: "/calendar",
    icon: CalendarDays,
    color: "violet",
  },
  {
    id: "language",
    label: "Language Test",
    description: "언어 전환 → 앱 전반 한국어/영어 확인",
    href: "/my",
    icon: Languages,
    color: "gray",
  },
];

const colorMap: Record<string, string> = {
  sky: "bg-sky-50 text-sky-700 border-sky-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  gray: "bg-gray-50 text-gray-700 border-gray-100",
};

const iconBgMap: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  rose: "bg-rose-100 text-rose-600",
  amber: "bg-amber-100 text-amber-600",
  emerald: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function TestPage() {
  return (
    <AppShell>
      <TopBar title="Quick Test Guide" />
      <div className="space-y-4 px-4 py-4">
        {/* Intro */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-semibold text-sky-900">테스터 안내</p>
          <p className="mt-1 text-xs leading-relaxed text-sky-700">
            아래 시나리오를 순서대로 체험해보세요. 각 항목을 탭하면 해당 기능으로 바로 이동합니다.
            문제를 발견하면 하단의 피드백 버튼을 눌러주세요.
          </p>
        </div>

        {/* Scenarios */}
        <div className="space-y-3">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.id}
                href={s.href}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors active:opacity-80 ${colorMap[s.color]}`}
              >
                <div className={`rounded-xl p-2.5 ${iconBgMap[s.color]}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="mt-0.5 text-xs opacity-80">{s.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Feedback */}
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-600 px-4 py-4 text-sm font-semibold text-white shadow-sm transition-colors active:bg-emerald-700"
        >
          <MessageSquarePlus size={18} />
          Send Feedback
          <ExternalLink size={14} className="opacity-70" />
        </a>

        <p className="text-center text-xs text-gray-400">
          Landly Beta · 외부 테스트용
        </p>
      </div>
    </AppShell>
  );
}
