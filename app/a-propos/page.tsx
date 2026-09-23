import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";

export const metadata = { title: "À propos" };

export default function AboutPage() {
  return (
    <div>
      <PageHero kicker="À PROPOS DE NOUS" title="Des collections pensées pour vous!" image="/products/photo-23.jpg" />
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <Image src="/products/photo-24.jpg" alt="Élégance Elaine Fashion" width={900} height={700} className="w-full object-cover" />
        <div>
          <h2 className="font-serif text-4xl text-navy">L&apos;élégance au cœur de notre engagement.</h2>
          <p className="mt-6 text-sm leading-7 text-navy/80">
            Elaine Fashion est née de la passion pour la mode et du désir d&apos;offrir aux femmes un style de vêtements,
            chaussures, sacs et accessoires qui allient élégance, qualité et modernité. Nous croyons que la mode est bien plus
            qu&apos;une simple forme de s&apos;habiller : c&apos;est un moyen d&apos;exprimer sa personnalité, sa confiance et son style.
          </p>
          <div className="mt-8 h-px w-full bg-black/10" />
          <p className="mt-6 text-sm italic text-navy/80">
            « La mode est une manière d&apos;exprimer sa personne. Chez Elaine Fashion, notre mission est de vous aider à
            révéler votre élégance avec des collections modernes, raffinées et accessibles. »
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Image src="/logo.png" alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
            <div>
              <p className="font-medium">Albertina Elaine Djata</p>
              <p className="text-sm text-muted">CEO &amp; Co-founder @ Elaine Fashion</p>
            </div>
          </div>
        </div>
      </section>
      <CtaBanner />
    </div>
  );
}
