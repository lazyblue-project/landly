import { NextResponse } from "next/server";
import { buildBetaPatchPlanReport } from "@/lib/beta-patch-plan";
import { LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    persisted: false,
    version: LANDLY_RELEASE_VERSION,
    schema: "landly-beta-patch-plan",
    acceptedPayload: {
      userFeedbackRecords: "UserFeedbackRecord[]",
      betaFeedbackRecords: "BetaFeedbackRecord[]",
      translationFeedbackRecords: "TranslationFeedbackRecord[]",
    },
    note: "POST tester signals to receive a local-first patch plan. This endpoint does not store payloads.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const report = buildBetaPatchPlanReport({
      userFeedbackRecords: Array.isArray(body?.userFeedbackRecords) ? body.userFeedbackRecords : [],
      betaFeedbackRecords: Array.isArray(body?.betaFeedbackRecords) ? body.betaFeedbackRecords : [],
      translationFeedbackRecords: Array.isArray(body?.translationFeedbackRecords) ? body.translationFeedbackRecords : [],
      version: LANDLY_RELEASE_VERSION,
    });
    return NextResponse.json({ status: "ok", persisted: false, report });
  } catch (error) {
    return NextResponse.json({ status: "error", persisted: false, message: error instanceof Error ? error.message : "Unable to build patch plan" }, { status: 400 });
  }
}
