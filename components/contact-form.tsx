"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { saveContactMessage } from "@/lib/messages";
import { useRecaptcha } from "@/components/recaptcha-provider";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [securityError, setSecurityError] = useState(false);
  const { t } = useI18n();
  const { verify } = useRecaptcha();

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setSubmitting(true);
        setSent(false);
        setSecurityError(false);

        try {
          const verified = await verify("contact");
          if (!verified) {
            setSecurityError(true);
            return;
          }

          saveContactMessage({
            name: String(data.get("name") ?? ""),
            email: String(data.get("email") ?? ""),
            phone: String(data.get("phone") ?? ""),
            message: String(data.get("message") ?? ""),
          });
          form.reset();
          setSent(true);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="block text-sm">
        {t("formName")} *
        <input required name="name" className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <label className="block text-sm">
        {t("formEmail")} *
        <input required type="email" name="email" className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <label className="block text-sm">
        {t("formPhone")} *
        <input required name="phone" className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <label className="block text-sm">
        {t("formMessage")}
        <textarea name="message" rows={5} className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("formSubmit")}
      </button>
      {securityError ? (
        <p role="alert" className="text-sm text-red-600">
          {t("recaptchaError")}
        </p>
      ) : null}
      {sent ? <p className="text-sm text-navy">{t("contactSent")}</p> : null}
    </form>
  );
}
