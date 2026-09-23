"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label className="block text-sm">
        Name *
        <input required name="name" className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <label className="block text-sm">
        Email *
        <input required type="email" name="email" className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <label className="block text-sm">
        Phone *
        <input required name="phone" className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <label className="block text-sm">
        Message
        <textarea name="message" rows={5} className="mt-1 w-full border border-black/15 px-3 py-2" />
      </label>
      <button type="submit" className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white">
        Submit
      </button>
      {sent ? <p className="text-sm text-navy">Merci, votre message a été envoyé.</p> : null}
    </form>
  );
}
