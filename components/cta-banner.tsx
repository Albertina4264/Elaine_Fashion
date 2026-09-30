"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function CtaBanner() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/products/photo-23.jpg)" }} />
      <div className="absolute inset-0 bg-[#c4a574]/55" />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center text-white">
        <h2 className="font-serif text-4xl md:text-5xl">{t("ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm md:text-base">{t("ctaBody")}</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
        >
          {t("seeMore")}
        </Link>
      </div>
    </section>
  );
}
