import { NextResponse } from "next/server";
import { buildBetaTriageReport } from "@/lib/beta-triage";
import { LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";
import type { BetaFeedbackRecord, TranslationFeedbackRecord, UserFeedbackRecord } from "@/types";

function isRecordArray(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object");
}

export async function GET() {
  return NextResponse.json(
    {
      status: "ready",
      version: LANDLY_RELEASE_VERSION,
      schema: "landly-beta-triage",
      mode: "local-first",
      note: "POST local feedback arrays to this endpoint to receive a computed triage report. The server does not persist payloads.",
      acceptedPayload: {
        userFeedbackRecords: "UserFeedbackRecord[]",
        betaFeedbackRecords: "BetaFeedbackRecord[]",
        translationFeedbackRecords: "TranslationFeedbackRecord[]",
      },
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ status: "error", message: "Payload must be an object" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const userFeedbackRecords = isRecordArray(payload.userFeedbackRecords) ? (payload.userFeedbackRecords as UserFeedbackRecord[]) : [];
  const betaFeedbackRecords = isRecordArray(payload.betaFeedbackRecords) ? (payload.betaFeedbackRecords as BetaFeedbackRecord[]) : [];
  const translationFeedbackRecords = isRecordArray(payload.translationFeedbackRecords) ? (payload.translationFeedbackRecords as TranslationFeedbackRecord[]) : [];

  const report = buildBetaTriageReport({
    userFeedbackRecords,
    betaFeedbackRecords,
    translationFeedbackRecords,
    version: LANDLY_RELEASE_VERSION,
  });

  return NextResponse.json(
    {
      status: "ok",
      persisted: false,
      report,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
