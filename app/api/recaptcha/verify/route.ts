import { NextResponse, type NextRequest } from "next/server";
import { isRecaptchaAction } from "@/lib/recaptcha/actions";
import { verifyRecaptchaToken } from "@/lib/recaptcha/server";

export const runtime = "nodejs";

function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim();
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  const { token, action } = payload as Record<string, unknown>;

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 4096 ||
    !isRecaptchaAction(action)
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  const result = await verifyRecaptchaToken({
    token,
    expectedAction: action,
    expectedHostname: request.nextUrl.hostname,
    remoteIp: clientIp(request),
  });

  if (!result.ok) {
    const status = result.reason === "configuration" ? 503 : 403;
    return NextResponse.json(
      { ok: false, error: "recaptcha_rejected" },
      { status },
    );
  }

  return NextResponse.json({ ok: true });
}
