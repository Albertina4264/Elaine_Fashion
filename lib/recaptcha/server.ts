import "server-only";

import type { RecaptchaAction } from "@/lib/recaptcha/actions";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_SCORE_THRESHOLD = 0.5;

type GoogleVerificationResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export type RecaptchaVerificationResult =
  | { ok: true; score: number }
  | {
      ok: false;
      reason:
        | "configuration"
        | "google_error"
        | "invalid_token"
        | "low_score"
        | "action_mismatch"
        | "hostname_mismatch";
    };

function scoreThreshold() {
  const configured = Number(process.env.RECAPTCHA_SCORE_THRESHOLD);
  return Number.isFinite(configured) && configured >= 0 && configured <= 1
    ? configured
    : DEFAULT_SCORE_THRESHOLD;
}

function normalizedHostname(value: string | undefined) {
  return value?.trim().toLowerCase().replace(/\.$/, "") ?? "";
}

export async function verifyRecaptchaToken({
  token,
  expectedAction,
  expectedHostname,
  remoteIp,
}: {
  token: string;
  expectedAction: RecaptchaAction;
  expectedHostname: string;
  remoteIp?: string;
}): Promise<RecaptchaVerificationResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not configured.");
    return { ok: false, reason: "configuration" };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) body.set("remoteip", remoteIp);

  let verification: GoogleVerificationResponse;

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Google reCAPTCHA verification returned", response.status);
      return { ok: false, reason: "google_error" };
    }

    verification = (await response.json()) as GoogleVerificationResponse;
  } catch (error) {
    console.error("Unable to reach Google reCAPTCHA verification.", error);
    return { ok: false, reason: "google_error" };
  }

  if (!verification.success) {
    console.warn(
      "Google reCAPTCHA rejected a token.",
      verification["error-codes"] ?? [],
    );
    return { ok: false, reason: "invalid_token" };
  }

  if (verification.action !== expectedAction) {
    return { ok: false, reason: "action_mismatch" };
  }

  if (
    normalizedHostname(verification.hostname) !==
    normalizedHostname(expectedHostname)
  ) {
    return { ok: false, reason: "hostname_mismatch" };
  }

  const score = verification.score;
  if (typeof score !== "number" || score < scoreThreshold()) {
    return { ok: false, reason: "low_score" };
  }

  return { ok: true, score };
}
