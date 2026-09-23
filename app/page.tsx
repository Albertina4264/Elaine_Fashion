import Image from "next/image";
import Link from "next/link";
import { Box, CreditCard, Heart, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CtaBanner } from "@/components/cta-banner";
import { categories, getFeatured, getPopular } from "@/lib/products";

const perks = [
  {
    icon: CreditCard,
    title: "Paiement sécurisé",
    text: "Vos paiements sont protégés grâce à un système de sécurité",
  },
  {
    icon: Truck,
    title: "Livraison gratuite",
    text: "Pour les achats supérieurs à 50.000 XOF.",
  },
  {
    icon: Box,
    title: "Qualité garantie",
    text: "Des produits soigneusement sélectionnés pour vous",
  },
  {
    icon: Heart,
    title: "Service client",
    text: "Votre satisfaction est notre priorité.",
  },
];

const reviews = [
  {
    name: "Matilda",
    text: "J’ai déjà trouvé la robe que je portais pour une occasion spéciale. Elle était parfaite, confortable et très élégante. Je suis ravie de mon achat.",
    image: "/products/photo-01.png",
  },
  {
    name: "Joseph",
    text: "Une boutique que je recommande à toutes les femmes. Les produits sont tendance, les prix sont accessibles et la qualité est au rendez-vous. Merci Elaine Fashion!",
    image: "/products/photo-24.jpg",
  },
  {
    name: "Anna",
    text: "J’ai déjà adoré mon expérience avec Elaine Fashion ! Les vues sont magnifiques, de très bonnes qualités et exactement comme les photos. La livraison a été rapide et le service client est exceptionnel.",
    image: "/products/photo-09.png",
  },
];

export default function HomePage() {
  const tendances = getFeatured();
  const popular = getPopular();

  return (
    <div id="top">
      <section className="relative min-h-[92vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/products/photo-23.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/25" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 pt-28 md:px-12">
          <h1 className="max-w-xl font-serif text-5xl text-navy md:text-6xl">Chaque détail compte.</h1>
          <p className="font-script mt-2 text-4xl text-gold md:text-5xl">Chaque style aussi.</p>
          <div className="mt-6 h-px w-40 bg-navy/40" />
          <p className="mt-6 max-w-md text-sm leading-6 text-navy md:text-base">
            Découvrez des vêtements, chaussures et accessoires soigneusement sélectionnés pour révéler votre style.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex w-fit cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
          >
            voir plus
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center font-serif text-4xl text-navy">Tendances</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {tendances.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/products/photo-24.jpg)" }}
        />
        <div className="absolute inset-0 bg-[#e8d3b0]/70" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl">Vente Flash: Jusqu&apos;à -50% sur une sélection !</h2>
          <p className="mt-4 text-sm md:text-base">
            Ne manquez pas notre vente flash ! Pour une durée limitée, profitez de réductions allant jusqu&apos;à -50% sur une
            sélection de nos articles phares.
          </p>
          <Link
            href="/promotions"
            className="mt-8 inline-flex cursor-pointer rounded-full border border-white px-8 py-3 text-sm transition-colors hover:bg-white hover:text-navy"
          >
            Acheter
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center font-serif text-4xl text-navy">Nos Catégories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="cursor-pointer text-center">
              <Image
                src={category.image}
                alt={category.name}
                width={480}
                height={520}
                className="aspect-[4/5] w-full object-cover"
              />
              <p className="mt-4 font-medium text-navy">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/products/photo-24.jpg" alt="Collection Elaine Fashion" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-8 py-16 md:px-16">
          <h2 className="font-serif text-4xl text-navy md:text-5xl">La mode qui révèle votre élégance.</h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-muted">
            Chez Elaine Fashion, nous pensons que chaque femme mérite de se sentir belle, élégante et confiante. Notre
            collection de vêtements, chaussures, sacs et accessoires est soigneusement sélectionnée pour vous offrir des
            pièces tendance, de qualité et adaptées à toutes les occasions.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div>
              <p className="font-serif text-4xl text-navy">98%</p>
              <p className="text-sm text-muted">Clients satisfaits</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-navy">500+</p>
              <p className="text-sm text-muted">Articles disponibles</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center font-serif text-4xl text-navy">Produits populaires</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {popular.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl text-navy">Ce que nos clients disent</h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              Découvrez pourquoi nos clients nous font confiance et choisissent Elaine Fashion pour leur style au quotidien.
            </p>
            <blockquote className="mt-8 rounded-md bg-[#f8f1de] p-6">
              <p className="text-gold text-3xl leading-none">“</p>
              <p className="text-sm leading-6 text-navy/80">{reviews[0].text}</p>
              <div className="mt-4 flex items-center gap-3">
                <Image src={reviews[0].image} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
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
                  <Image src={review.image} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
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
