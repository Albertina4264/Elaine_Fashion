"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { useI18n } from "@/lib/i18n";

export function ContactPageContent() {
  const { t } = useI18n();
  return (
    <div>
      <PageHero kicker={t("contactKicker")} title={t("contactTitle")} image="/products/photo-23.jpg" />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-serif text-4xl text-navy">{t("contactHeading")}</h2>
          <ul className="mt-10 space-y-8">
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 text-navy" />
              <div>
                <p className="font-medium">{t("phoneLabel")}</p>
                <a href="tel:788317477" className="cursor-pointer text-muted">
                  788317477
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 text-navy" />
              <div>
                <p className="font-medium">{t("emailLabel")}</p>
                <a href="mailto:elaine-fashion@gmail.com" className="cursor-pointer text-muted">
                  elaine-fashion@gmail.com
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 text-navy" />
              <div>
                <p className="font-medium">{t("addressLabel")}</p>
                <p className="text-muted">Rue LIB 42, 332</p>
              </div>
            </li>
          </ul>
        </div>
        <ContactForm />
      </section>
      <section className="px-4 pb-16 text-center">
        <h2 className="font-serif text-2xl text-navy">{t("followUs")}</h2>
      </section>
      <CtaBanner />
    </div>
  );
}
