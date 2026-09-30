"use client";

import Link from "next/link";
import { PromotionsGrid } from "@/components/promotions-grid";
import { useI18n } from "@/lib/i18n";

export function PromotionsPageContent() {
  const { t } = useI18n();
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/people/promo-hero.jpg)" }} />
        <div className="absolute inset-0 bg-[#c4a070]/55" />
        <div className="relative z-10 max-w-3xl px-6 pb-16 pt-32 text-white md:px-16">
          <p className="text-sm tracking-[0.2em]">{t("promoExclusive")}</p>
          <div className="mt-4 h-px w-40 bg-white/70" />
          <h1 className="mt-6 font-serif text-5xl">{t("promoHeroTitle")}</h1>
          <Link href="/shop" className="mt-8 inline-flex cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white">
            {t("promoCta")}
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <PromotionsGrid />
      </section>
    </div>
  );
}
