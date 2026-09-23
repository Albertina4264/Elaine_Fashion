import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getPromos } from "@/lib/products";

export const metadata = { title: "Promotions" };

export default function PromotionsPage() {
  const promos = getPromos();
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/products/photo-24.jpg)" }}
        />
        <div className="absolute inset-0 bg-[#c4a070]/55" />
        <div className="relative z-10 max-w-3xl px-6 pb-16 pt-32 text-white md:px-16">
          <p className="text-sm tracking-[0.2em]">EXCLUSIVITÉ ELAINE FASHION</p>
          <div className="mt-4 h-px w-40 bg-white/70" />
          <h1 className="mt-6 font-serif text-5xl">Jusqu&apos;à -50%</h1>
          <Link
            href="/shop"
            className="mt-8 inline-flex cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white"
          >
            En profiter
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((product) => (
            <div key={product.slug}>
              <ProductCard product={product} />
              {product.promoPercent ? (
                <p className="mt-2 text-sm text-gold">Promotion : -{product.promoPercent}%</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
