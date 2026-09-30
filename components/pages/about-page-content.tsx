"use client";

import Image from "next/image";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { useI18n } from "@/lib/i18n";

export function AboutPageContent() {
  const { t } = useI18n();
  return (
    <div>
      <PageHero kicker={t("aboutKicker")} title={t("aboutTitle")} image="/products/photo-23.jpg" />
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <Image src="/products/photo-24.jpg" alt="" width={900} height={700} className="w-full object-cover" />
        <div>
          <h2 className="font-serif text-4xl text-navy">{t("aboutHeading")}</h2>
          <p className="mt-6 text-sm leading-7 text-navy/80">{t("aboutBody1")}</p>
          <div className="mt-8 h-px w-full bg-black/10" />
          <p className="mt-6 text-sm italic text-navy/80">{t("aboutQuote")}</p>
          <div className="mt-8 flex items-center gap-4">
            <Image src="/people/team-green.png" alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
            <div>
              <p className="font-medium">Albertina Elaine Djata</p>
              <p className="text-sm text-muted">{t("ceoRole")}</p>
            </div>
          </div>
        </div>
      </section>
      <CtaBanner />
    </div>
  );
}
