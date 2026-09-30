"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, CreditCard, Heart, Truck } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { HomePopular, HomeTrends } from "@/components/home-catalog-sections";
import { useI18n } from "@/lib/i18n";

const categoryLinks = [
  { key: "catDresses" as const, href: "/shop?categorie=Vêtements", image: "/products/photo-09.png" },
  { key: "catShoes" as const, href: "/shop?categorie=Chaussures", image: "/products/photo-16.png" },
  { key: "catJewelry" as const, href: "/shop?categorie=Accessoires", image: "/products/photo-18.png" },
  { key: "catBags" as const, href: "/shop?categorie=Sacs", image: "/products/photo-21.png" },
];

export function HomePageContent() {
  const { t } = useI18n();

  const perks = [
    { icon: CreditCard, title: t("perkPayTitle"), text: t("perkPayText") },
    { icon: Truck, title: t("perkShipTitle"), text: t("perkShipText") },
    { icon: Box, title: t("perkQualityTitle"), text: t("perkQualityText") },
    { icon: Heart, title: t("perkServiceTitle"), text: t("perkServiceText") },
  ];

  const reviews = [
    { name: "Matilda", text: t("review1"), image: "/people/matilda.jpg" },
    { name: "Joseph", text: t("review2"), image: "/people/joseph.jpg" },
    { name: "Anna", text: t("review3"), image: "/people/anna.jpg" },
  ];

  return (
    <div id="top">
      <section className="relative min-h-[92vh] overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster="/products/photo-23.jpg">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/25" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 pt-28 md:px-12">
          <h1 className="max-w-xl font-serif text-5xl text-navy md:text-6xl">{t("homeHeroTitle")}</h1>
          <p className="font-script mt-2 text-4xl text-gold md:text-5xl">{t("homeHeroScript")}</p>
          <div className="mt-6 h-px w-40 bg-navy/40" />
          <p className="mt-6 max-w-md text-sm leading-6 text-navy md:text-base">{t("homeHeroBody")}</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex w-fit cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
          >
            {t("seeMore")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center font-serif text-4xl text-navy">{t("homeTrends")}</h2>
        <HomeTrends />
      </section>

      <section className="border-t border-black/5 px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-navy">
                <perk.icon className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl text-navy">{perk.title}</h3>
              <p className="mt-2 text-sm text-muted">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/people/promo-hero.jpg)" }} />
        <div className="absolute inset-0 bg-[#c4a070]/55" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl">{t("homeFlashTitle")}</h2>
          <p className="mt-4 text-sm md:text-base">{t("homeFlashBody")}</p>
          <Link
            href="/promotions"
            className="mt-8 inline-flex cursor-pointer rounded-full border border-white px-8 py-3 text-sm transition-colors hover:bg-white hover:text-navy"
          >
            {t("homeFlashCta")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center font-serif text-4xl text-navy">{t("homeCategories")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryLinks.map((category) => (
            <Link key={category.key} href={category.href} className="cursor-pointer text-center">
              <Image src={category.image} alt={t(category.key)} width={480} height={520} className="aspect-[4/5] w-full object-cover" />
              <p className="mt-4 font-medium text-navy">{t(category.key)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/products/photo-24.jpg" alt="Elaine Fashion" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-8 py-16 md:px-16">
          <h2 className="font-serif text-4xl text-navy md:text-5xl">{t("homeEleganceTitle")}</h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-muted">{t("homeEleganceBody")}</p>
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div>
              <p className="font-serif text-4xl text-navy">98%</p>
              <p className="text-sm text-muted">{t("statSatisfied")}</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-navy">500+</p>
              <p className="text-sm text-muted">{t("statArticles")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center font-serif text-4xl text-navy">{t("homePopular")}</h2>
        <HomePopular />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl text-navy">{t("homeTestimonialsTitle")}</h2>
            <p className="mt-3 max-w-md text-sm text-muted">{t("homeTestimonialsIntro")}</p>
            <blockquote className="mt-8 rounded-md bg-[#f8f1de] p-6">
              <p className="text-gold text-3xl leading-none">“</p>
              <p className="text-sm leading-6 text-navy/80">{reviews[0].text}</p>
              <div className="mt-4 flex items-center gap-3">
                <Image src={reviews[0].image} alt={reviews[0].name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                <span className="text-sm">{reviews[0].name}</span>
              </div>
            </blockquote>
          </div>
          <div className="space-y-6">
            {reviews.slice(1).map((review) => (
              <blockquote key={review.name} className="rounded-md bg-[#f8f1de] p-6">
                <p className="text-gold text-3xl leading-none">“</p>
                <p className="text-sm leading-6 text-navy/80">{review.text}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Image src={review.image} alt={review.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                  <span className="text-sm">{review.name}</span>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
