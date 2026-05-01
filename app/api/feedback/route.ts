import { NextResponse } from "next/server";
import { LANDLY_RELEASE_VERSION } from "@/lib/release-metadata";

const MAX_NOTE_LENGTH = 1200;
const ALLOWED_CATEGORIES = new Set(["useful", "confusing", "missing", "bug", "idea"]);
const ALLOWED_RATINGS = new Set([1, 2, 3, 4, 5]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;

    if (!isRecord(payload)) {
      return NextResponse.json({ accepted: false, error: "Invalid feedback payload." }, { status: 400 });
    }

    const note = typeof payload.note === "string" ? payload.note.trim() : "";
    const category = typeof payload.category === "string" ? payload.category : "";
    const rating = typeof payload.rating === "number" ? payload.rating : Number(payload.rating);

    if (!note || note.length > MAX_NOTE_LENGTH) {
      return NextResponse.json(
        { accepted: false, error: `Feedback note must be 1-${MAX_NOTE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORIES.has(category) || !ALLOWED_RATINGS.has(rating)) {
      return NextResponse.json({ accepted: false, error: "Unsupported feedback category or rating." }, { status: 400 });
    }

    return NextResponse.json(
      {
        accepted: true,
        app: "Landly",
        version: LANDLY_RELEASE_VERSION,
        receivedAt: new Date().toISOString(),
        storage: "not-persisted-in-this-mvp-api-stub",
        forwardingConfigured: Boolean(process.env.LANDLY_FEEDBACK_WEBHOOK_URL),
        privacyNote:
          "This endpoint validates feedback payloads and can be wired to a server-side webhook later. The current MVP response does not persist personal data.",
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json({ accepted: false, error: "Unable to parse feedback payload." }, { status: 400 });
  }
}
