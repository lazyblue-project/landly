import type { TrustBadgeTone, TrustMetadata } from "@/types";

export type FreshnessStatus = "fresh" | "aging" | "stale" | "unknown";

export interface FreshnessSummary {
  status: FreshnessStatus;
  label: string;
  detail: string;
  tone: TrustBadgeTone;
  daysSinceChecked?: number;
  shouldConfirm: boolean;
  sourceCtaLabel: string;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const monthIndex: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return new Date(year, month - 1, day);
}

function parseMonthYear(value: string) {
  const parts = value.trim().replace(",", "").split(/\s+/);
  if (parts.length !== 2) return null;
  const month = monthIndex[parts[0].toLowerCase()];
  const year = Number(parts[1]);
  if (month === undefined || !year) return null;
  return new Date(year, month, 1);
}

export function parseTrustDate(value?: string) {
  if (!value) return null;
  return parseIsoDate(value) ?? parseMonthYear(value);
}

export function getDaysSinceTrustCheck(lastCheckedAt?: string, now = new Date()) {
  const parsed = parseTrustDate(lastCheckedAt);
  if (!parsed) return undefined;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const checked = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  return Math.max(0, Math.floor((today.getTime() - checked.getTime()) / ONE_DAY_MS));
}

export function getFreshnessSummary(metadata: TrustMetadata, now = new Date()): FreshnessSummary {
  const daysSinceChecked = getDaysSinceTrustCheck(metadata.lastCheckedAt, now);
  const baseConfirm = Boolean(metadata.needsConfirmation || metadata.trustLevel === "needs-check" || metadata.trustLevel === "demo");

  if (daysSinceChecked === undefined) {
    return {
      status: "unknown",
      label: "Check source",
      detail: "No last-checked date is saved for this card.",
      tone: "amber",
      shouldConfirm: true,
      sourceCtaLabel: "Open official source first",
    };
  }

  if (daysSinceChecked > 180) {
    return {
      status: "stale",
      label: "Stale check",
      detail: "This information has not been checked recently.",
      tone: "rose",
      daysSinceChecked,
      shouldConfirm: true,
      sourceCtaLabel: "Open official source first",
    };
  }

  if (daysSinceChecked > 90) {
    return {
      status: "aging",
      label: "Check soon",
      detail: "This information may still be useful, but rules or hours can change.",
      tone: "amber",
      daysSinceChecked,
      shouldConfirm: true,
      sourceCtaLabel: "Confirm source before acting",
    };
  }

  return {
    status: "fresh",
    label: "Recently checked",
    detail: baseConfirm
      ? "The source was checked recently, but this card still needs live confirmation before action."
      : "The source was checked recently.",
    tone: baseConfirm ? "amber" : "emerald",
    daysSinceChecked,
    shouldConfirm: baseConfirm,
    sourceCtaLabel: baseConfirm ? "Confirm source before acting" : "Open official source",
  };
}

export function sortByTrustRisk<T extends TrustMetadata>(items: T[]) {
  return [...items].sort((a, b) => {
    const aFreshness = getFreshnessSummary(a);
    const bFreshness = getFreshnessSummary(b);
    const rank: Record<FreshnessStatus, number> = { stale: 0, unknown: 1, aging: 2, fresh: 3 };
    return rank[aFreshness.status] - rank[bFreshness.status];
  });
}
