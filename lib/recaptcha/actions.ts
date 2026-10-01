export const RECAPTCHA_ACTIONS = [
  "login",
  "admin_login",
  "register",
  "forgot_password",
  "contact",
  "checkout",
] as const;

export type RecaptchaAction = (typeof RECAPTCHA_ACTIONS)[number];

export function isRecaptchaAction(value: unknown): value is RecaptchaAction {
  return (
    typeof value === "string" &&
    RECAPTCHA_ACTIONS.includes(value as RecaptchaAction)
  );
}
