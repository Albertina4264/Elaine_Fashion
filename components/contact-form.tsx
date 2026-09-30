"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { saveContactMessage } from "@/lib/messages";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { t } = useI18n();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        saveContactMessage({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("message") ?? ""),
        });
        event.currentTarget.reset();
        setSent(true);
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
      <button type="submit" className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white">
        {t("formSubmit")}
      </button>
      {sent ? <p className="text-sm text-navy">{t("contactSent")}</p> : null}
    </form>
  );
}
